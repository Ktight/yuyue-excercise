from datetime import time, timedelta

import pytest
from django.utils import timezone

from apps.accounts.models import User
from apps.attendance.models import Attendance
from apps.companies.models import Room
from apps.courses.models import CourseBooking, CourseSchedule, CourseTemplate
from apps.members.models import StudentProfile
from apps.training.models import ClassRecord, TrainingPlan
from core.constants import AttendanceStatus, MemberCardType, UserRole


pytestmark = pytest.mark.django_db

POSE_SEQUENCE = {
    'warmup': [{'name': 'Breathing', 'duration': 5}],
    'main': [
        {
            'name': 'Warrior II',
            'duration': 10,
            'notes': 'Keep front knee aligned',
        }
    ],
    'cooldown': [{'name': 'Savasana', 'duration': 5}],
}


@pytest.fixture
def class_context(
    test_company,
    test_store,
    trainer_user,
    student_user,
):
    room = Room.objects.create(
        store=test_store,
        name='Record Room',
        capacity=8,
        facilities={},
    )
    template = CourseTemplate.objects.create(
        company=test_company,
        name='Record Course',
        category='group',
        duration_minutes=60,
        max_capacity=8,
        difficulty='beginner',
        description='Class record flow',
        status='active',
    )
    schedule = CourseSchedule.objects.create(
        company=test_company,
        store=test_store,
        room=room,
        course_template=template,
        trainer=trainer_user,
        course_date=timezone.localdate(),
        start_time=time(10),
        end_time=time(11),
        capacity=8,
        schedule_mode='single',
        status='completed',
    )
    booking = CourseBooking.objects.create(
        company=test_company,
        schedule=schedule,
        student=student_user,
        status='booked',
    )
    attendance = Attendance.objects.create(
        company=test_company,
        booking=booking,
        schedule=schedule,
        student=student_user,
        check_in_time=timezone.now(),
        status=AttendanceStatus.PRESENT,
        checked_by=trainer_user,
    )
    plan = TrainingPlan.objects.create(
        company=test_company,
        student=student_user.student_profile,
        trainer=trainer_user,
        title='Core Plan',
        start_date=timezone.localdate() - timedelta(days=7),
        end_date=timezone.localdate() + timedelta(days=30),
        target_frequency_per_week=2,
        goal_description='Core flow test',
        focus_tags=['core'],
        status='active',
    )
    return {
        'schedule': schedule,
        'attendance': attendance,
        'plan': plan,
    }


def _record_payload(attendance_id, **overrides):
    payload = {
        'attendance_id': attendance_id,
        'theme': 'Core stability',
        'pose_sequence': POSE_SEQUENCE,
        'trainer_notes': 'Good control',
        'homework': 'Practice breathing',
        'completion_rating': 4,
        'improvement_tags': ['alignment'],
        'next_focus': 'balance',
    }
    payload.update(overrides)
    return payload


def test_create_class_record_links_checked_in_attendance(
    api_client,
    trainer_user,
    class_context,
):
    api_client.force_authenticate(trainer_user)

    response = api_client.post(
        '/api/class-records/',
        _record_payload(class_context['attendance'].id),
        format='json',
    )

    assert response.status_code == 201
    record = ClassRecord.objects.get(pk=response.data['data']['id'])
    assert record.attendance_id == class_context['attendance'].id
    assert record.schedule_id == class_context['schedule'].id
    assert record.trainer_id == trainer_user.id


def test_pose_sequence_is_stored_as_json(
    api_client,
    trainer_user,
    class_context,
):
    api_client.force_authenticate(trainer_user)

    response = api_client.post(
        '/api/class-records/',
        _record_payload(class_context['attendance'].id),
        format='json',
    )

    assert response.status_code == 201
    record = ClassRecord.objects.get(pk=response.data['data']['id'])
    assert record.pose_sequence == POSE_SEQUENCE
    assert record.pose_sequence['main'][0]['name'] == 'Warrior II'


def test_class_record_links_training_plan(
    api_client,
    trainer_user,
    class_context,
):
    api_client.force_authenticate(trainer_user)
    payload = _record_payload(
        class_context['attendance'].id,
        plan=class_context['plan'].id,
    )

    response = api_client.post(
        '/api/class-records/',
        payload,
        format='json',
    )

    assert response.status_code == 201
    record = ClassRecord.objects.get(pk=response.data['data']['id'])
    assert record.plan_id == class_context['plan'].id
    assert record.session_number == 1


def test_batch_create_class_records_for_checked_in_students(
    api_client,
    trainer_user,
    student_user,
    test_company,
    test_store,
    class_context,
):
    second_student = User.objects.create_user(
        phone='13940000001',
        password='TestPass123!',
        name='Second Student',
        role=UserRole.STUDENT,
        company=test_company,
        store=test_store,
    )
    StudentProfile.objects.create(
        user=second_student,
        company=test_company,
        home_store=test_store,
        primary_trainer=trainer_user,
        gender='female',
        emergency_contact='13940000002',
        member_card_type=MemberCardType.COUNT,
        member_card_start=timezone.localdate(),
        member_card_expire=timezone.localdate() + timedelta(days=90),
        member_card_balance=10,
        health_notes='',
        injury_history='',
        contraindications='',
        training_goal='Batch record',
        preferred_style='Group',
    )
    booking = CourseBooking.objects.create(
        company=test_company,
        schedule=class_context['schedule'],
        student=second_student,
        status='booked',
    )
    Attendance.objects.create(
        company=test_company,
        booking=booking,
        schedule=class_context['schedule'],
        student=second_student,
        check_in_time=timezone.now(),
        status=AttendanceStatus.LATE,
        checked_by=trainer_user,
    )
    api_client.force_authenticate(trainer_user)

    response = api_client.post(
        '/api/training/batch-records/',
        {
            'schedule_id': class_context['schedule'].id,
            'common_data': {
                'theme': 'Batch core class',
                'pose_sequence': POSE_SEQUENCE,
                'trainer_notes': 'Shared note',
                'homework': 'Shared practice',
            },
            'student_overrides': {
                str(student_user.id): {
                    'completion_rating': 5,
                    'improvement_tags': ['strength'],
                },
                str(second_student.id): {
                    'completion_rating': 3,
                    'improvement_tags': ['mobility'],
                },
            },
        },
        format='json',
    )

    assert response.status_code == 201
    assert response.data['data']['created_count'] == 2
    records = ClassRecord.objects.filter(
        schedule=class_context['schedule']
    )
    assert records.count() == 2
    assert set(records.values_list('student_id', flat=True)) == {
        student_user.id,
        second_student.id,
    }
