"""Role-scoped dashboard aggregation and derived reminder services."""

from datetime import timedelta

from django.db import transaction
from django.db.models import Count, F, Max, Q
from django.utils import timezone

from apps.courses.models import CourseBooking, CourseSchedule
from apps.members.models import StudentProfile
from apps.training.models import ClassRecord, TrainingPlan
from core.constants import (
    AttendanceStatus,
    MemberCardType,
    ReminderCategory,
    ReminderPriority,
    UserRole,
)

from .models import ReminderState


ATTENDED_STATUSES = (AttendanceStatus.PRESENT, AttendanceStatus.LATE)
PRIORITY_ORDER = {
    ReminderPriority.HIGH: 0,
    ReminderPriority.NORMAL: 1,
    ReminderPriority.LOW: 2,
}


def _scope(queryset, user, company_field='company_id', store_field='store_id'):
    if user.role == UserRole.SUPER_ADMIN:
        return queryset
    queryset = queryset.filter(**{company_field: user.company_id})
    if user.role == UserRole.STORE_MANAGER:
        queryset = queryset.filter(**{store_field: user.store_id})
    return queryset


def _active_students(user):
    today = timezone.localdate()
    queryset = _scope(
        StudentProfile.objects.all(),
        user,
        store_field='home_store_id',
    )
    return queryset.filter(
        user__is_active=True,
        member_card_active=True,
        member_card_start__lte=today,
        member_card_expire__gte=today,
    ).filter(
        ~Q(member_card_type__in=(MemberCardType.COUNT, MemberCardType.STORED))
        | Q(member_card_balance__gt=0)
    ).count()


def _today_schedules(user):
    schedules = _scope(
        CourseSchedule.objects.filter(course_date=timezone.localdate())
        .exclude(status='cancelled')
        .select_related('course_template', 'trainer', 'room')
        .annotate(
            booked_count=Count(
                'bookings',
                filter=Q(bookings__status='booked'),
                distinct=True,
            )
        ),
        user,
    )
    return [
        {
            'id': schedule.id,
            'time': schedule.start_time.strftime('%H:%M'),
            'course_name': schedule.course_template.name,
            'trainer_name': schedule.trainer.name,
            'room_name': schedule.room.name,
            'booked': schedule.booked_count,
            'capacity': schedule.capacity,
        }
        for schedule in schedules.order_by('start_time', 'id')
    ]


def _booking_trend(user):
    today = timezone.localdate()
    days = [today - timedelta(days=offset) for offset in range(6, -1, -1)]
    bookings = _scope(
        CourseBooking.objects.filter(
            status='booked',
            schedule__course_date__range=(days[0], days[-1]),
        ),
        user,
        store_field='schedule__store_id',
    )
    counts = {
        row['schedule__course_date']: row['count']
        for row in bookings.values('schedule__course_date').annotate(
            count=Count('id')
        )
    }
    return [
        {'label': day.isoformat(), 'value': counts.get(day, 0)}
        for day in days
    ]


def get_admin_dashboard(user):
    """Return the Phase 11 candidate dashboard in the application timezone."""
    schedules = _today_schedules(user)
    reminders = get_reminders(user, include_dismissed=False)
    return {
        'generated_at': timezone.localtime().isoformat(),
        'timezone': timezone.get_current_timezone_name(),
        'metrics': {
            'today_classes': len(schedules),
            'today_bookings': sum(item['booked'] for item in schedules),
            'active_students': _active_students(user),
            'pending_items': sum(not item['is_read'] for item in reminders),
        },
        'booking_trend': _booking_trend(user),
        'today_schedules': schedules,
    }


def _reminder_candidates(user):
    today = timezone.localdate()
    soon = today + timedelta(days=7)
    stale_before = today - timedelta(days=14)
    candidates = []

    schedules = _scope(
        CourseSchedule.objects.filter(course_date=today)
        .exclude(status='cancelled')
        .annotate(
            booked_count=Count(
                'bookings',
                filter=Q(bookings__status='booked'),
                distinct=True,
            )
        )
        .filter(booked_count__gte=F('capacity')),
        user,
    )
    for schedule in schedules.order_by('start_time', 'id'):
        candidates.append(
            {
                'source_key': f'full_schedule:{schedule.id}',
                'title': '课程已满员',
                'message': (
                    f'{schedule.start_time:%H:%M} 的课程已达到'
                    f' {schedule.capacity} 人容量。'
                ),
                'category': ReminderCategory.BOOKING,
                'priority': ReminderPriority.HIGH,
                'action_label': '查看排课',
                'action_to': f'/admin/schedules/{schedule.id}',
            }
        )

    missing_attendance = _scope(
        CourseBooking.objects.filter(
            status='booked',
            schedule__course_date=today,
            schedule__status='completed',
            attendance__isnull=True,
        ),
        user,
        store_field='schedule__store_id',
    ).count()
    if missing_attendance:
        candidates.append(
            {
                'source_key': f'missing_attendance:{today.isoformat()}',
                'title': '考勤待确认',
                'message': f'今天有 {missing_attendance} 条预约尚未确认考勤。',
                'category': ReminderCategory.ATTENDANCE,
                'priority': ReminderPriority.NORMAL,
                'action_label': '处理考勤',
                'action_to': '/admin/attendance',
            }
        )

    expiring = _scope(
        StudentProfile.objects.filter(
            member_card_active=True,
            member_card_expire__range=(today, soon),
        ).select_related('user'),
        user,
        store_field='home_store_id',
    )
    for profile in expiring.order_by('member_card_expire', 'id'):
        candidates.append(
            {
                'source_key': f'membership_expiry:{profile.id}',
                'title': '会员即将到期',
                'message': f'{profile.user.name} 的会员将在 7 天内到期。',
                'category': ReminderCategory.MEMBERSHIP,
                'priority': ReminderPriority.NORMAL,
                'action_label': '查看学员',
                'action_to': f'/admin/students/{profile.user_id}',
            }
        )

    inactive = _scope(
        StudentProfile.objects.annotate(
            last_class_date=Max(
                'user__attendances__schedule__course_date',
                filter=Q(
                    user__attendances__status__in=ATTENDED_STATUSES
                ),
            )
        ).filter(
            Q(last_class_date__lt=stale_before)
            | Q(
                last_class_date__isnull=True,
                created_at__date__lte=stale_before,
            )
        ).select_related('user'),
        user,
        store_field='home_store_id',
    )
    for profile in inactive.order_by('last_class_date', 'id'):
        candidates.append(
            {
                'source_key': f'student_inactive:{profile.id}',
                'title': '学员流失风险',
                'message': f'{profile.user.name} 已超过 2 周未上课。',
                'category': ReminderCategory.TRAINING,
                'priority': ReminderPriority.NORMAL,
                'action_label': '查看学员',
                'action_to': f'/admin/students/{profile.user_id}',
            }
        )

    plans = _scope(
        TrainingPlan.objects.filter(
            status='active',
            end_date__range=(today, soon),
        ).select_related('student'),
        user,
        store_field='student__home_store_id',
    )
    for plan in plans.order_by('end_date', 'id'):
        candidates.append(
            {
                'source_key': f'plan_expiry:{plan.id}',
                'title': '训练规划即将到期',
                'message': f'训练规划“{plan.title}”将在 7 天内到期。',
                'category': ReminderCategory.TRAINING,
                'priority': ReminderPriority.LOW,
                'action_label': '查看训练规划',
                'action_to': f'/admin/training-plans/{plan.id}',
            }
        )

    drafts = _scope(
        ClassRecord.objects.filter(status='draft').select_related('student'),
        user,
    )
    for record in drafts.order_by('class_date', 'id'):
        candidates.append(
            {
                'source_key': f'draft_class:{record.id}',
                'title': '课时记录待完成',
                'message': f'{record.student.name} 的课时记录仍为草稿。',
                'category': ReminderCategory.TRAINING,
                'priority': ReminderPriority.LOW,
                'action_label': '查看课时记录',
                'action_to': f'/admin/class-records/{record.id}',
            }
        )
    return candidates


@transaction.atomic
def get_reminders(user, include_dismissed=False, unread_only=False):
    """Materialize current derived reminders and merge per-user state."""
    reminders = []
    for candidate in _reminder_candidates(user):
        source_key = candidate['source_key']
        state, _ = ReminderState.objects.get_or_create(
            user=user,
            source_key=source_key,
        )
        if state.is_dismissed and not include_dismissed:
            continue
        if unread_only and state.is_read:
            continue
        reminders.append(
            {
                'id': state.id,
                **{
                    key: value
                    for key, value in candidate.items()
                    if key != 'source_key'
                },
                'created_at': state.created_at,
                'is_read': state.is_read,
                'is_dismissed': state.is_dismissed,
            }
        )
    return sorted(
        reminders,
        key=lambda item: (
            PRIORITY_ORDER[item['priority']],
            -item['created_at'].timestamp(),
            -item['id'],
        ),
    )


def update_reminder_state(user, reminder_id, field):
    """Apply an idempotent state transition scoped to the current user."""
    current = {
        item['id']: item
        for item in get_reminders(user, include_dismissed=True)
    }
    reminder = current.get(reminder_id)
    if reminder is None:
        return None
    state = ReminderState.objects.get(user=user, pk=reminder_id)
    if not getattr(state, field):
        setattr(state, field, True)
        state.save(update_fields=(field, 'updated_at'))
    reminder[field] = True
    return reminder
