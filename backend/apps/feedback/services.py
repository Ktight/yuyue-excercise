from django.db import transaction
from django.db.models import Case, IntegerField, Value, When
from django.utils import timezone

from apps.attendance.models import Attendance
from apps.members.models import BodyAssessment, StudentProfile
from apps.training.models import ClassRecord, TrainingPlan
from apps.training.services import calculate_plan_progress
from core.constants import AttendanceStatus
from core.exceptions import ConflictError, ResourceNotFound

from .models import StudentFeedback


ATTENDED_STATUSES = {
    AttendanceStatus.PRESENT,
    AttendanceStatus.LATE,
}


@transaction.atomic
def create_student_feedback(student, data):
    """Create one immutable feedback resource for a completed owned record."""
    try:
        record = (
            ClassRecord.objects.select_for_update()
            .select_related('company', 'student')
            .get(pk=data['class_record'])
        )
    except ClassRecord.DoesNotExist:
        raise ResourceNotFound(
            code='CLASS_RECORD_NOT_FOUND',
            message='课时记录不存在。',
        ) from None

    if (
        record.student_id != student.id
        or record.company_id != student.company_id
    ):
        raise ResourceNotFound(
            code='CLASS_RECORD_NOT_FOUND',
            message='课时记录不存在。',
        )
    if record.status != 'completed':
        raise ConflictError(
            code='CLASS_RECORD_NOT_COMPLETED',
            message='仅已完成的课时可以提交反馈。',
        )
    if StudentFeedback.objects.filter(class_record=record).exists():
        raise ConflictError(
            code='FEEDBACK_ALREADY_EXISTS',
            message='该课时已经提交过反馈。',
        )

    return StudentFeedback.objects.create(
        company_id=record.company_id,
        class_record=record,
        student=student,
        feeling=data['feeling'],
        improvement_note=data.get('improvement_note', ''),
        comment=data.get('comment', ''),
        photos=[],
    )


def _assessment_data(assessment):
    if assessment is None:
        return None
    return {
        'id': assessment.id,
        'date': assessment.assess_date.isoformat(),
        'height_cm': assessment.height,
        'weight_kg': assessment.weight,
        'posture_spine': assessment.posture_spine,
        'posture_pelvis': assessment.posture_pelvis,
        'posture_shoulder': assessment.posture_shoulder,
        'flexibility_score': assessment.flexibility_score,
        'core_strength_score': assessment.core_strength_score,
        'notes': assessment.notes,
    }


def _assessment_changes(before, after):
    if before is None or after is None or before.pk == after.pk:
        return None

    fields = {
        'height_cm': 'height',
        'weight_kg': 'weight',
        'flexibility_score': 'flexibility_score',
        'core_strength_score': 'core_strength_score',
    }
    changes = {}
    for output_name, model_name in fields.items():
        before_value = getattr(before, model_name)
        after_value = getattr(after, model_name)
        changes[output_name] = (
            round(after_value - before_value, 2)
            if before_value is not None and after_value is not None
            else None
        )
    return changes


def _body_comparison(profile, start_date, end_date):
    assessments = BodyAssessment.objects.filter(student=profile)
    before = assessments.filter(
        assess_date__lte=start_date
    ).order_by('-assess_date', '-id').first()
    after = assessments.filter(
        assess_date__lte=end_date
    ).order_by('-assess_date', '-id').first()

    reason = None
    if before is None and after is None:
        reason = 'NO_BODY_ASSESSMENTS'
    elif before is None:
        reason = 'NO_BASELINE_ASSESSMENT'
    elif after is None:
        reason = 'NO_END_ASSESSMENT'
    elif before.pk == after.pk:
        reason = 'SINGLE_BODY_ASSESSMENT'

    return {
        'before': _assessment_data(before),
        'after': _assessment_data(after),
        'changes': _assessment_changes(before, after),
        'reason': reason,
    }


def _training_plan_data(profile, start_date, end_date):
    plan = (
        TrainingPlan.objects.filter(
            student=profile,
            start_date__lte=end_date,
            end_date__gte=start_date,
        )
        .annotate(
            status_order=Case(
                When(status='active', then=Value(0)),
                When(status='paused', then=Value(1)),
                default=Value(2),
                output_field=IntegerField(),
            )
        )
        .order_by('status_order', '-created_at', '-id')
        .first()
    )
    if plan is None:
        return None
    progress = calculate_plan_progress(plan)
    return {
        'id': plan.id,
        'title': plan.title,
        'status': plan.status,
        'start_date': plan.start_date.isoformat(),
        'end_date': plan.end_date.isoformat(),
        'target_frequency_per_week': plan.target_frequency_per_week,
        'focus_tags': plan.focus_tags,
        'total_sessions': progress['total_sessions'],
        'completed_sessions': progress['completed'],
        'progress_percentage': progress['percentage'],
    }


def generate_report_data(student_id, start_date, end_date):
    """Aggregate one Student User's live preview for an inclusive range."""
    profile = StudentProfile.objects.select_related(
        'user',
        'primary_trainer',
    ).get(user_id=student_id)
    records = list(
        ClassRecord.objects.filter(
            student_id=student_id,
            class_date__range=(start_date, end_date),
            status='completed',
        )
        .select_related('trainer')
        .order_by('class_date', 'created_at', 'id')
    )
    total_sessions = len(records)

    attendance_statuses = list(
        Attendance.objects.filter(
            student_id=student_id,
            schedule__course_date__range=(start_date, end_date),
            booking__status='booked',
        ).values_list('status', flat=True)
    )
    attended_count = sum(
        status in ATTENDED_STATUSES for status in attendance_statuses
    )
    attendance_rate = (
        round(attended_count / len(attendance_statuses), 4)
        if attendance_statuses
        else None
    )

    rated_records = [
        record for record in records
        if record.completion_rating is not None
    ]
    average_rating = (
        round(
            sum(record.completion_rating for record in rated_records)
            / len(rated_records),
            2,
        )
        if rated_records
        else None
    )
    rating_trend = [
        {
            'date': record.class_date.isoformat(),
            'class_record_id': record.id,
            'rating': record.completion_rating,
        }
        for record in rated_records
    ]

    feedbacks = list(
        StudentFeedback.objects.filter(
            student_id=student_id,
            class_record__class_date__range=(start_date, end_date),
            class_record__status='completed',
        )
        .select_related('class_record')
        .order_by('class_record__class_date', 'id')
    )
    distribution = {'easy': 0, 'moderate': 0, 'hard': 0}
    for feedback in feedbacks:
        distribution[feedback.feeling] += 1
    representative_comments = [
        {
            'date': feedback.class_record.class_date.isoformat(),
            'class_record_id': feedback.class_record_id,
            'improvement_note': feedback.improvement_note,
            'comment': feedback.comment,
        }
        for feedback in feedbacks
        if feedback.improvement_note.strip() or feedback.comment.strip()
    ][:3]

    trainer_comments = [
        {
            'date': record.class_date.isoformat(),
            'class_record_id': record.id,
            'trainer_id': record.trainer_id,
            'trainer_name': record.trainer.name,
            'theme': record.theme,
            'comment': record.trainer_notes,
        }
        for record in records
        if record.trainer_notes.strip()
    ]
    plan_data = _training_plan_data(profile, start_date, end_date)
    body_comparison = _body_comparison(profile, start_date, end_date)

    data_notes = []
    if not attendance_statuses:
        data_notes.append('NO_ATTENDANCE_DATA')
    if not rated_records:
        data_notes.append('NO_RATING_DATA')
    if not feedbacks:
        data_notes.append('NO_FEEDBACK_DATA')
    if body_comparison['reason']:
        data_notes.append(body_comparison['reason'])
    if plan_data is None:
        data_notes.append('NO_TRAINING_PLAN')

    primary_trainer = profile.primary_trainer
    return {
        'student': {
            'id': profile.user_id,
            'name': profile.user.name,
            'avatar': profile.user.avatar or None,
        },
        'trainer': (
            {
                'id': primary_trainer.id,
                'name': primary_trainer.name,
                'avatar': primary_trainer.avatar or None,
            }
            if primary_trainer is not None
            else None
        ),
        'range_start': start_date.isoformat(),
        'range_end': end_date.isoformat(),
        'generated_at': timezone.now().isoformat(),
        'total_sessions': total_sessions,
        'train_count': total_sessions,
        'attendance_rate': attendance_rate,
        'average_rating': average_rating,
        'rating_trend': rating_trend,
        'body_comparison': body_comparison,
        'feedback_summary': {
            'total': len(feedbacks),
            'distribution': distribution,
            'representative_comments': representative_comments,
            'reason': None if feedbacks else 'NO_FEEDBACK_DATA',
        },
        'trainer_comments': trainer_comments,
        'training_plan': plan_data,
        'data_notes': data_notes,
    }
