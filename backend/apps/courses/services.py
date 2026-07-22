from datetime import timedelta

from django.db import IntegrityError, transaction
from django.db.models import Q
from django.utils import timezone

from apps.accounts.models import User
from apps.members.models import StudentProfile
from apps.members.services import validate_member_card
from core.constants import MemberCardType
from core.exceptions import ConflictError, ContractAPIException, ResourceNotFound

from .models import CourseBooking, CourseSchedule


def create_recurring_schedules(base_data, recurring_rule, end_date=None):
    """Create weekly schedules atomically and return the created row count."""
    weekdays = sorted(set(recurring_rule['weekdays']))
    weeks = recurring_rule['weeks']
    start_date = base_data['course_date']
    week_start = start_date - timedelta(days=start_date.isoweekday() - 1)

    course_dates = []
    for week_index in range(weeks):
        current_week = week_start + timedelta(weeks=week_index)
        for weekday in weekdays:
            course_date = current_week + timedelta(days=weekday - 1)
            if course_date < start_date:
                continue
            if end_date is not None and course_date > end_date:
                continue
            course_dates.append(course_date)

    if not course_dates:
        return 0

    conflict_filter = Q(
        room=base_data['room'],
        course_date__in=course_dates,
        start_time=base_data['start_time'],
    ) | Q(
        trainer=base_data['trainer'],
        course_date__in=course_dates,
        start_time=base_data['start_time'],
    )

    with transaction.atomic():
        conflicts = CourseSchedule.objects.filter(conflict_filter)
        if conflicts.filter(room=base_data['room']).exists():
            raise ConflictError(
                message='场地在所选周期时间内已有排课。',
                errors={'room': ['场地排课时间冲突。']},
            )
        if conflicts.filter(trainer=base_data['trainer']).exists():
            raise ConflictError(
                message='训练师在所选周期时间内已有排课。',
                errors={'trainer': ['训练师排课时间冲突。']},
            )

        schedules = []
        for course_date in course_dates:
            schedule_data = dict(base_data)
            schedule_data.update(
                course_date=course_date,
                schedule_mode='recurring',
                recurring_rule=recurring_rule,
            )
            schedules.append(CourseSchedule(**schedule_data))
        try:
            CourseSchedule.objects.bulk_create(schedules)
        except IntegrityError as exc:
            raise ConflictError(
                message='周期排课与已有排课冲突。'
            ) from exc

    return len(schedules)


def create_booking(schedule_id, student_id, company_id):
    """Validate eligibility and create one booking atomically."""
    with transaction.atomic():
        try:
            schedule = CourseSchedule.objects.select_for_update().get(
                pk=schedule_id,
                company_id=company_id,
            )
        except CourseSchedule.DoesNotExist:
            raise ResourceNotFound(message='排课不存在。') from None

        if schedule.status != 'published':
            raise ContractAPIException(message='该排课未发布，无法预约。')
        if (
            schedule.booking_deadline is not None
            and timezone.now() > schedule.booking_deadline
        ):
            raise ContractAPIException(message='已超过预约截止时间。')

        try:
            student = User.objects.get(pk=student_id, company_id=company_id)
        except User.DoesNotExist:
            raise ResourceNotFound(message='学员不存在。') from None

        if CourseBooking.objects.filter(
            schedule=schedule,
            student=student,
        ).exists():
            raise ConflictError(message='该学员已预约这节课。')

        booked_count = CourseBooking.objects.filter(
            schedule=schedule,
            status='booked',
        ).count()
        if booked_count >= schedule.capacity:
            raise ConflictError(message='该课程已满员。')

        has_time_conflict = CourseBooking.objects.filter(
            student=student,
            status='booked',
            schedule__course_date=schedule.course_date,
            schedule__start_time__lt=schedule.end_time,
            schedule__end_time__gt=schedule.start_time,
        ).exists()
        if has_time_conflict:
            raise ConflictError(message='学员在该时间段已有其他课程。')

        try:
            profile = StudentProfile.objects.select_for_update().get(
                user=student,
                company_id=company_id,
            )
        except StudentProfile.DoesNotExist:
            raise ContractAPIException(message='学员尚未建立会员档案。') from None

        is_valid, reason = validate_member_card(profile)
        if not is_valid:
            raise ContractAPIException(message=reason or '会员卡不可用。')

        try:
            booking = CourseBooking.objects.create(
                company_id=company_id,
                schedule=schedule,
                student=student,
                status='booked',
            )
        except IntegrityError as exc:
            raise ConflictError(message='该学员已预约这节课。') from exc

        if profile.member_card_type == MemberCardType.COUNT:
            profile.member_card_balance -= 1
            profile.save(update_fields=['member_card_balance', 'updated_at'])

    return booking


def cancel_booking(booking_id, company_id, student_id=None, schedule_id=None):
    """Cancel an active booking and restore one count-card use."""
    with transaction.atomic():
        queryset = CourseBooking.objects.select_for_update().select_related('student')
        if student_id is not None:
            queryset = queryset.filter(student_id=student_id)
        if schedule_id is not None:
            queryset = queryset.filter(schedule_id=schedule_id)
        try:
            booking = queryset.get(pk=booking_id, company_id=company_id)
        except CourseBooking.DoesNotExist:
            raise ResourceNotFound(message='预约记录不存在。') from None

        if booking.status == 'cancelled':
            raise ConflictError(message='该预约已取消。')

        try:
            profile = StudentProfile.objects.select_for_update().get(
                user=booking.student,
                company_id=company_id,
            )
        except StudentProfile.DoesNotExist:
            raise ContractAPIException(message='学员会员档案不存在。') from None

        booking.status = 'cancelled'
        booking.save(update_fields=['status', 'updated_at'])
        if profile.member_card_type == MemberCardType.COUNT:
            profile.member_card_balance += 1
            profile.save(update_fields=['member_card_balance', 'updated_at'])

    return booking
