from datetime import time, timedelta

import pytest
from django.utils import timezone

from apps.accounts.models import User
from apps.companies.models import Room
from apps.courses.models import CourseBooking, CourseSchedule, CourseTemplate
from apps.members.models import StudentProfile
from core.constants import MemberCardType, UserRole


pytestmark = pytest.mark.django_db


@pytest.fixture
def course_template(test_company):
    return CourseTemplate.objects.create(
        company=test_company,
        name='Core Flow Course',
        category='group',
        duration_minutes=60,
        max_capacity=10,
        difficulty='beginner',
        description='Booking flow test',
        status='active',
    )


@pytest.fixture
def room(test_store):
    return Room.objects.create(
        store=test_store,
        name='Room A',
        capacity=10,
        facilities={'mats': 10},
    )


@pytest.fixture
def schedule(
    test_company,
    test_store,
    trainer_user,
    course_template,
    room,
):
    return CourseSchedule.objects.create(
        company=test_company,
        store=test_store,
        room=room,
        course_template=course_template,
        trainer=trainer_user,
        course_date=timezone.localdate() + timedelta(days=7),
        start_time=time(10),
        end_time=time(11),
        capacity=2,
        booking_deadline=timezone.now() + timedelta(days=6),
        schedule_mode='single',
        status='published',
    )


def _book(api_client, student, schedule):
    api_client.force_authenticate(student)
    return api_client.post(
        f'/api/schedules/{schedule.id}/book/',
        {},
        format='json',
    )


def test_normal_booking_creates_booking_and_consumes_count_card(
    api_client,
    student_user,
    schedule,
):
    response = _book(api_client, student_user, schedule)

    assert response.status_code == 201
    assert CourseBooking.objects.filter(
        schedule=schedule,
        student=student_user,
        status='booked',
    ).exists()
    student_user.student_profile.refresh_from_db()
    assert student_user.student_profile.member_card_balance == 9


def test_expired_membership_blocks_booking(
    api_client,
    student_user,
    schedule,
):
    profile = student_user.student_profile
    profile.member_card_expire = timezone.localdate() - timedelta(days=1)
    profile.save(update_fields=['member_card_expire', 'updated_at'])

    response = _book(api_client, student_user, schedule)

    assert response.status_code == 400
    assert not CourseBooking.objects.filter(
        schedule=schedule,
        student=student_user,
    ).exists()


def test_full_schedule_blocks_booking(
    api_client,
    student_user,
    schedule,
    test_company,
    test_store,
    trainer_user,
):
    schedule.capacity = 1
    schedule.save(update_fields=['capacity', 'updated_at'])
    other_student = User.objects.create_user(
        phone='13930000001',
        password='TestPass123!',
        name='Other Student',
        role=UserRole.STUDENT,
        company=test_company,
        store=test_store,
    )
    StudentProfile.objects.create(
        user=other_student,
        company=test_company,
        home_store=test_store,
        primary_trainer=trainer_user,
        gender='male',
        emergency_contact='13930000002',
        member_card_type=MemberCardType.COUNT,
        member_card_start=timezone.localdate(),
        member_card_expire=timezone.localdate() + timedelta(days=30),
        member_card_balance=5,
        health_notes='',
        injury_history='',
        contraindications='',
        training_goal='Capacity test',
        preferred_style='Group',
    )
    CourseBooking.objects.create(
        company=test_company,
        schedule=schedule,
        student=other_student,
        status='booked',
    )

    response = _book(api_client, student_user, schedule)

    assert response.status_code == 409
    assert response.data['code'] == 'CONFLICT'


def test_duplicate_booking_is_blocked(
    api_client,
    student_user,
    schedule,
):
    assert _book(api_client, student_user, schedule).status_code == 201

    duplicate = _book(api_client, student_user, schedule)

    assert duplicate.status_code == 409
    assert CourseBooking.objects.filter(
        schedule=schedule,
        student=student_user,
    ).count() == 1


def test_overlapping_booking_is_blocked(
    api_client,
    student_user,
    schedule,
    test_company,
    test_store,
    trainer_user,
    course_template,
):
    assert _book(api_client, student_user, schedule).status_code == 201
    second_room = Room.objects.create(
        store=test_store,
        name='Room B',
        capacity=10,
        facilities={},
    )
    overlapping = CourseSchedule.objects.create(
        company=test_company,
        store=test_store,
        room=second_room,
        course_template=course_template,
        trainer=trainer_user,
        course_date=schedule.course_date,
        start_time=time(10, 30),
        end_time=time(11, 30),
        capacity=2,
        booking_deadline=timezone.now() + timedelta(days=6),
        schedule_mode='single',
        status='published',
    )

    response = _book(api_client, student_user, overlapping)

    assert response.status_code == 409
    assert not CourseBooking.objects.filter(
        schedule=overlapping,
        student=student_user,
    ).exists()
