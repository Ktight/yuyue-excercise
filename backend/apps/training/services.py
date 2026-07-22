"""Business operations for training records."""

from django.db import transaction
from rest_framework import serializers

from apps.attendance.models import Attendance
from apps.courses.models import CourseSchedule
from core.constants import AttendanceStatus
from core.exceptions import ConflictError, ResourceNotFound

from .models import ClassRecord


def calculate_session_number(student_id, plan_id):
    """Return the next one-based session number for a student's plan."""
    if plan_id is None:
        return 1
    return (
        ClassRecord.objects.filter(student_id=student_id, plan_id=plan_id).count()
        + 1
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
    if plan is not None and (
        plan.company_id != attendance.company_id
        or plan.student_id != attendance.student_id
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
