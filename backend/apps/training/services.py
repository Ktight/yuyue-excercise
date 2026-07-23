"""Business operations for training records."""

from math import ceil

from django.db import transaction
from rest_framework import serializers

from apps.attendance.models import Attendance
from apps.courses.models import CourseSchedule
from core.constants import AttendanceStatus
from core.exceptions import ConflictError, ResourceNotFound

from .models import ClassRecord, TrainingPlan


def calculate_plan_progress(plan):
    """Calculate completed-session progress and rating direction for a plan."""
    completed_records = plan.class_records.filter(
        status='completed'
    ).order_by('class_date', 'created_at', 'id')
    completed = completed_records.count()
    inclusive_days = max((plan.end_date - plan.start_date).days + 1, 0)
    weeks = ceil(inclusive_days / 7) if inclusive_days else 0
    total_sessions = weeks * plan.target_frequency_per_week
    percentage = (
        round(min(completed / total_sessions * 100, 100), 2)
        if total_sessions
        else 0
    )

    ratings = list(
        completed_records.exclude(completion_rating__isnull=True)
        .values_list('completion_rating', flat=True)
    )
    avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else None
    rating_trend = 'stable'
    if len(ratings) >= 2:
        if ratings[-1] > ratings[0]:
            rating_trend = 'up'
        elif ratings[-1] < ratings[0]:
            rating_trend = 'down'

    return {
        'total_sessions': total_sessions,
        'completed': completed,
        'percentage': percentage,
        'avg_rating': avg_rating,
        'rating_trend': rating_trend,
    }


def calculate_session_number(student_id, plan_id):
    """Return the next one-based session number for a student's plan."""
    if plan_id is None:
        return 1
    return (
        ClassRecord.objects.filter(student_id=student_id, plan_id=plan_id).count()
        + 1
    )


def auto_link_plan(student_id):
    """Return the active plan id for a ClassRecord student User id."""
    return (
        TrainingPlan.objects.filter(
            student__user_id=student_id,
            status='active',
        )
        .order_by('-created_at', '-id')
        .values_list('id', flat=True)
        .first()
    )


@transaction.atomic
def create_class_record_from_attendance(attendance_id, data):
    """Create one class record and derive scheduling fields from attendance."""
    try:
        attendance = (
            Attendance.objects.select_for_update()
            .select_related('schedule', 'schedule__trainer', 'schedule__store')
            .get(pk=attendance_id)
        )
    except Attendance.DoesNotExist:
        raise ResourceNotFound(message='签到记录不存在。') from None

    if ClassRecord.objects.filter(attendance=attendance).exists():
        raise ConflictError(
            code='CLASS_RECORD_ALREADY_COMPLETED',
            message='该签到已关联课时记录。',
        )
    if attendance.status not in {
        AttendanceStatus.PRESENT,
        AttendanceStatus.LATE,
    }:
        raise serializers.ValidationError(
            {'attendance_id': ['仅已签到或迟到的记录可创建课时记录。']}
        )

    record_data = dict(data)
    plan = record_data.get('plan')
    if 'plan' not in record_data:
        plan_id = auto_link_plan(attendance.student_id)
        if plan_id is not None:
            plan = TrainingPlan.objects.select_for_update().get(pk=plan_id)
            record_data['plan'] = plan
    elif plan is not None:
        plan = TrainingPlan.objects.select_for_update().get(pk=plan.pk)
        record_data['plan'] = plan

    if plan is not None and (
        plan.company_id != attendance.company_id
        or plan.student.user_id != attendance.student_id
    ):
        raise serializers.ValidationError(
            {'plan': ['训练规划必须属于该学员和公司。']}
        )

    record_data.setdefault(
        'session_number',
        calculate_session_number(
            attendance.student_id,
            getattr(plan, 'id', None),
        ),
    )
    return ClassRecord.objects.create(
        company_id=attendance.company_id,
        attendance=attendance,
        schedule=attendance.schedule,
        student=attendance.student,
        trainer=attendance.schedule.trainer,
        store=attendance.schedule.store,
        class_date=attendance.schedule.course_date,
        **record_data,
    )


@transaction.atomic
def batch_create_class_records(schedule_id, common_data, student_overrides):
    """Create records for every checked-in student in one atomic operation."""
    try:
        schedule = CourseSchedule.objects.select_related(
            'trainer',
            'store',
        ).get(pk=schedule_id)
    except CourseSchedule.DoesNotExist:
        raise ResourceNotFound(message='排课不存在。') from None

    attendances = list(
        Attendance.objects.select_for_update()
        .select_related('student')
        .filter(
            schedule=schedule,
            status__in=[AttendanceStatus.PRESENT, AttendanceStatus.LATE],
        )
        .order_by('id')
    )
    if not attendances:
        raise serializers.ValidationError(
            {'schedule_id': ['该排课没有已签到学员。']}
        )

    attended_student_ids = {
        attendance.student_id for attendance in attendances
    }
    unknown_student_ids = sorted(
        set(student_overrides) - attended_student_ids
    )
    if unknown_student_ids:
        raise serializers.ValidationError(
            {
                'student_overrides': [
                    f'以下学员未签到：{unknown_student_ids}'
                ]
            }
        )

    records = []
    for attendance in attendances:
        record_data = dict(common_data)
        record_data.update(student_overrides.get(attendance.student_id, {}))
        records.append(
            create_class_record_from_attendance(attendance.id, record_data)
        )
    return records
