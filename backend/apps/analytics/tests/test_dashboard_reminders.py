from datetime import time, timedelta

import pytest
from django.utils import timezone

from apps.accounts.models import User
from apps.companies.models import Company, Room, Store
from apps.courses.models import CourseBooking, CourseSchedule, CourseTemplate
from apps.members.models import StudentProfile
from apps.analytics.models import ReminderState
from core.constants import MemberCardType, UserRole


pytestmark = pytest.mark.django_db


def _schedule(
    test_company,
    test_store,
    trainer_user,
    student_user,
    *,
    suffix='',
    start_hour=10,
):
    room = Room.objects.create(
        store=test_store,
        name=f'Dashboard Room{suffix}',
        capacity=1,
        facilities={},
    )
    template = CourseTemplate.objects.create(
        company=test_company,
        name=f'Dashboard Course{suffix}',
        category='group',
        duration_minutes=60,
        max_capacity=1,
        difficulty='beginner',
        description='Dashboard integration',
        status='active',
    )
    schedule = CourseSchedule.objects.create(
        company=test_company,
        store=test_store,
        room=room,
        course_template=template,
        trainer=trainer_user,
        course_date=timezone.localdate(),
        start_time=time(start_hour),
        end_time=time(start_hour + 1),
        capacity=1,
        schedule_mode='single',
        status='published',
    )
    CourseBooking.objects.create(
        company=test_company,
        schedule=schedule,
        student=student_user,
        status='booked',
    )
    return schedule


def test_admin_dashboard_matches_candidate_shape_and_scope(
    api_client,
    company_admin_user,
    trainer_user,
    student_user,
    test_company,
    test_store,
):
    schedule = _schedule(
        test_company,
        test_store,
        trainer_user,
        student_user,
    )
    api_client.force_authenticate(company_admin_user)

    response = api_client.get('/api/dashboards/admin/')

    assert response.status_code == 200
    data = response.data['data']
    assert data['timezone'] == 'Asia/Shanghai'
    assert data['metrics']['today_classes'] == 1
    assert data['metrics']['today_bookings'] == 1
    assert len(data['booking_trend']) == 7
    assert data['today_schedules'][0]['id'] == schedule.id


def test_dashboard_excludes_another_company(
    api_client,
    company_admin_user,
    test_company,
    test_store,
    trainer_user,
    student_user,
):
    _schedule(test_company, test_store, trainer_user, student_user)
    today = timezone.localdate()
    company_b = Company.objects.create(
        name='Dashboard Company B',
        contact_person='Admin B',
        contact_phone='13950000000',
        contract_start=today,
        contract_end=today + timedelta(days=365),
    )
    store_b = Store.objects.create(
        company=company_b,
        name='Dashboard Store B',
        address='Road B',
        phone='021-50000000',
        business_hours='08:00-22:00',
    )
    trainer_b = User.objects.create_user(
        phone='13950000001',
        password='TestPass123!',
        name='Trainer B',
        role=UserRole.TRAINER,
        company=company_b,
        store=store_b,
    )
    student_b = User.objects.create_user(
        phone='13950000002',
        password='TestPass123!',
        name='Student B',
        role=UserRole.STUDENT,
        company=company_b,
        store=store_b,
    )
    StudentProfile.objects.create(
        user=student_b,
        company=company_b,
        home_store=store_b,
        primary_trainer=trainer_b,
        gender='female',
        emergency_contact='13950000003',
        member_card_type=MemberCardType.COUNT,
        member_card_start=today,
        member_card_expire=today + timedelta(days=30),
        member_card_balance=5,
        member_card_active=True,
        health_notes='',
        injury_history='',
        contraindications='',
        training_goal='Tenant scope',
        preferred_style='Group',
    )
    _schedule(company_b, store_b, trainer_b, student_b)
    api_client.force_authenticate(company_admin_user)

    response = api_client.get('/api/dashboards/admin/')

    assert response.data['data']['metrics']['today_classes'] == 1
    assert response.data['data']['metrics']['today_bookings'] == 1


def test_reminder_list_is_paginated_and_actions_are_idempotent(
    api_client,
    company_admin_user,
    test_company,
    test_store,
    trainer_user,
    student_user,
):
    _schedule(test_company, test_store, trainer_user, student_user)
    api_client.force_authenticate(company_admin_user)

    listed = api_client.get('/api/reminders/?page=1&page_size=10')

    assert listed.status_code == 200
    assert listed.data['data']['total'] >= 1
    reminder = listed.data['data']['items'][0]
    assert reminder['category'] == 'booking'
    assert reminder['priority'] == 'high'
    assert reminder['action_to'].startswith('/admin/schedules/')

    first_read = api_client.post(
        f"/api/reminders/{reminder['id']}/read/",
        {},
        format='json',
    )
    second_read = api_client.post(
        f"/api/reminders/{reminder['id']}/read/",
        {},
        format='json',
    )
    assert first_read.status_code == second_read.status_code == 200
    assert second_read.data['data']['is_read'] is True

    first_dismiss = api_client.post(
        f"/api/reminders/{reminder['id']}/dismiss/",
        {},
        format='json',
    )
    second_dismiss = api_client.post(
        f"/api/reminders/{reminder['id']}/dismiss/",
        {},
        format='json',
    )
    assert first_dismiss.status_code == second_dismiss.status_code == 200
    assert second_dismiss.data['data']['is_dismissed'] is True
    remaining_ids = {
        item['id']
        for item in api_client.get('/api/reminders/').data['data']['items']
    }
    assert reminder['id'] not in remaining_ids


def test_unread_filter_is_applied_before_pagination(
    api_client,
    company_admin_user,
    test_company,
    test_store,
    trainer_user,
    student_user,
):
    _schedule(test_company, test_store, trainer_user, student_user)
    api_client.force_authenticate(company_admin_user)
    reminder_id = api_client.get('/api/reminders/').data['data']['items'][0]['id']
    api_client.post(
        f'/api/reminders/{reminder_id}/read/',
        {},
        format='json',
    )

    unread = api_client.get('/api/reminders/?unread_only=true')
    invalid = api_client.get('/api/reminders/?unread_only=not-a-boolean')

    assert unread.status_code == 200
    assert unread.data['data']['items'] == []
    assert unread.data['data']['total'] == 0
    assert invalid.status_code == 400
    assert invalid.data['code'] == 'VALIDATION_ERROR'


def test_students_and_trainers_cannot_access_management_analytics(
    api_client,
    trainer_user,
    student_user,
):
    for user in (trainer_user, student_user):
        api_client.force_authenticate(user)
        assert api_client.get('/api/dashboards/admin/').status_code == 403
        assert api_client.get('/api/reminders/').status_code == 403


def test_store_manager_is_limited_to_assigned_store(
    api_client,
    test_company,
    test_store,
    trainer_user,
    student_user,
):
    own_schedule = _schedule(
        test_company,
        test_store,
        trainer_user,
        student_user,
    )
    other_store = Store.objects.create(
        company=test_company,
        name='Other Store',
        address='Other Road',
        phone='021-10000001',
        business_hours='08:00-22:00',
    )
    other_trainer = User.objects.create_user(
        phone='13910000006',
        password='TestPass123!',
        name='Other Trainer',
        role=UserRole.TRAINER,
        company=test_company,
        store=other_store,
    )
    other_student = User.objects.create_user(
        phone='13910000007',
        password='TestPass123!',
        name='Other Student',
        role=UserRole.STUDENT,
        company=test_company,
        store=other_store,
    )
    other_schedule = _schedule(
        test_company,
        other_store,
        other_trainer,
        other_student,
        suffix=' Other',
        start_hour=12,
    )
    manager = User.objects.create_user(
        phone='13910000008',
        password='TestPass123!',
        name='Store Manager',
        role=UserRole.STORE_MANAGER,
        company=test_company,
        store=test_store,
    )
    api_client.force_authenticate(manager)

    dashboard = api_client.get('/api/dashboards/admin/')
    reminders = api_client.get('/api/reminders/').data['data']['items']

    assert dashboard.status_code == 200
    assert dashboard.data['data']['metrics']['today_classes'] == 1
    assert dashboard.data['data']['today_schedules'][0]['id'] == own_schedule.id
    action_targets = {item['action_to'] for item in reminders}
    assert f'/admin/schedules/{own_schedule.id}' in action_targets
    assert f'/admin/schedules/{other_schedule.id}' not in action_targets


def test_reminder_state_action_is_scoped_to_current_user(
    api_client,
    company_admin_user,
    test_company,
    test_store,
    trainer_user,
    student_user,
):
    _schedule(test_company, test_store, trainer_user, student_user)
    api_client.force_authenticate(company_admin_user)
    reminder_id = api_client.get('/api/reminders/').data['data']['items'][0]['id']
    other_admin = User.objects.create_user(
        phone='13910000009',
        password='TestPass123!',
        name='Other Admin',
        role=UserRole.COMPANY_ADMIN,
        company=test_company,
    )
    api_client.force_authenticate(other_admin)

    response = api_client.post(
        f'/api/reminders/{reminder_id}/read/',
        {},
        format='json',
    )

    assert response.status_code == 404
    assert ReminderState.objects.get(pk=reminder_id).is_read is False


def test_stale_reminder_cannot_be_mutated(
    api_client,
    company_admin_user,
    test_company,
    test_store,
    trainer_user,
    student_user,
):
    schedule = _schedule(
        test_company,
        test_store,
        trainer_user,
        student_user,
    )
    api_client.force_authenticate(company_admin_user)
    reminder_id = api_client.get('/api/reminders/').data['data']['items'][0]['id']
    schedule.delete()

    response = api_client.post(
        f'/api/reminders/{reminder_id}/dismiss/',
        {},
        format='json',
    )

    assert response.status_code == 404
    assert ReminderState.objects.get(pk=reminder_id).is_dismissed is False
