from datetime import datetime

from django.db import transaction
from django.utils import timezone

from core.constants import AttendanceStatus
from core.exceptions import ResourceNotFound

from .models import Attendance


@transaction.atomic
def auto_create_attendance_for_schedule(schedule):
    """Create absent attendance rows for every active booking."""
    created_count = 0
    bookings = schedule.bookings.filter(status='booked').select_related('student')
    for booking in bookings:
        _, created = Attendance.objects.get_or_create(
            booking=booking,
            defaults={
                'company_id': schedule.company_id,
                'schedule': schedule,
                'student': booking.student,
                'status': AttendanceStatus.ABSENT,
            },
        )
        created_count += int(created)
    return created_count


def _schedule_start(schedule):
    starts_at = datetime.combine(schedule.course_date, schedule.start_time)
    return timezone.make_aware(starts_at, timezone.get_current_timezone())


@transaction.atomic
def check_in(attendance_id, checked_by):
    """Check in one attendance record using the current project time zone."""
    try:
        attendance = Attendance.objects.select_for_update().select_related(
            'schedule'
        ).get(pk=attendance_id)
    except Attendance.DoesNotExist:
        raise ResourceNotFound(message='考勤记录不存在。') from None

    checked_at = timezone.now()
    attendance.check_in_time = checked_at
    attendance.status = (
        AttendanceStatus.PRESENT
        if checked_at <= _schedule_start(attendance.schedule)
        else AttendanceStatus.LATE
    )
    attendance.checked_by = checked_by
    attendance.save(
        update_fields=['check_in_time', 'status', 'checked_by', 'updated_at']
    )
    return attendance


@transaction.atomic
def batch_check_in(schedule_id, student_ids, checked_by):
    """Check in the selected students for one schedule atomically."""
    requested_ids = set(student_ids)
    attendances = list(
        Attendance.objects.select_for_update()
        .select_related('schedule')
        .filter(schedule_id=schedule_id, student_id__in=requested_ids)
    )
    found_ids = {attendance.student_id for attendance in attendances}
    missing_ids = sorted(requested_ids - found_ids)
    if missing_ids:
        raise ResourceNotFound(
            message='部分学员的考勤记录不存在。',
            errors={'student_ids': [f'未找到：{missing_ids}']},
        )

    checked_at = timezone.now()
    for attendance in attendances:
        attendance.check_in_time = checked_at
        attendance.status = (
            AttendanceStatus.PRESENT
            if checked_at <= _schedule_start(attendance.schedule)
            else AttendanceStatus.LATE
        )
        attendance.checked_by = checked_by
        attendance.updated_at = checked_at
    Attendance.objects.bulk_update(
        attendances,
        ['check_in_time', 'status', 'checked_by', 'updated_at'],
    )
    return attendances


@transaction.atomic
def mark_leave(attendance_id):
    """Mark one attendance record as leave."""
    try:
        attendance = Attendance.objects.select_for_update().get(pk=attendance_id)
    except Attendance.DoesNotExist:
        raise ResourceNotFound(message='考勤记录不存在。') from None
    attendance.status = AttendanceStatus.LEAVE
    attendance.save(update_fields=['status', 'updated_at'])
    return attendance


def get_student_attendance_stats(attendances, student_id):
    """Return attendance rate and current attendance streak for one student."""
    records = list(
        attendances.filter(student_id=student_id)
        .select_related('schedule')
        .order_by('-schedule__course_date', '-schedule__start_time', '-id')
    )
    attended_statuses = {AttendanceStatus.PRESENT, AttendanceStatus.LATE}
    attended_count = sum(
        attendance.status in attended_statuses for attendance in records
    )
    late_count = sum(
        attendance.status == AttendanceStatus.LATE for attendance in records
    )
    leave_count = sum(
        attendance.status == AttendanceStatus.LEAVE for attendance in records
    )
    consecutive_attendance = 0
    for attendance in records:
        if attendance.status not in attended_statuses:
            break
        consecutive_attendance += 1

    total_count = len(records)
    attendance_rate = (
        round(attended_count * 100 / total_count, 2) if total_count else 0.0
    )
    return {
        'student_id': student_id,
        'total_count': total_count,
        'attended_count': attended_count,
        'attendance_rate': attendance_rate,
        'late_count': late_count,
        'leave_count': leave_count,
        'consecutive_attendance': consecutive_attendance,
    }


def get_schedule_attendance_stats(schedule, attendances):
    """Return booking, arrival and attendance-rate totals for one schedule."""
    booking_count = schedule.bookings.filter(status='booked').count()
    arrived_count = attendances.filter(
        schedule=schedule,
        booking__status='booked',
        status__in=[AttendanceStatus.PRESENT, AttendanceStatus.LATE],
    ).count()
    attendance_rate = (
        round(arrived_count * 100 / booking_count, 2) if booking_count else 0.0
    )
    return {
        'schedule_id': schedule.id,
        'booking_count': booking_count,
        'arrived_count': arrived_count,
        'attendance_rate': attendance_rate,
    }
