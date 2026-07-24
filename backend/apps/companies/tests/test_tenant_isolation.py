from datetime import timedelta

import pytest
from django.utils import timezone

from apps.accounts.models import User
from apps.companies.models import Company, Store
from apps.members.models import StudentProfile
from core.constants import MemberCardType, UserRole


pytestmark = pytest.mark.django_db


def _second_tenant():
    today = timezone.localdate()
    company = Company.objects.create(
        name='Company B',
        contact_person='Company B Admin',
        contact_phone='13920000000',
        contract_start=today,
        contract_end=today + timedelta(days=365),
    )
    store = Store.objects.create(
        company=company,
        name='Store B',
        address='Tenant B Road',
        phone='021-20000000',
        business_hours='08:00-22:00',
    )
    trainer = User.objects.create_user(
        phone='13920000001',
        password='TestPass123!',
        name='Trainer B',
        role=UserRole.TRAINER,
        company=company,
        store=store,
    )
    student = User.objects.create_user(
        phone='13920000002',
        password='TestPass123!',
        name='Student B',
        role=UserRole.STUDENT,
        company=company,
        store=store,
    )
    StudentProfile.objects.create(
        user=student,
        company=company,
        home_store=store,
        primary_trainer=trainer,
        gender='female',
        emergency_contact='13920000003',
        member_card_type=MemberCardType.COUNT,
        member_card_start=today,
        member_card_expire=today + timedelta(days=90),
        member_card_balance=10,
        health_notes='',
        injury_history='',
        contraindications='',
        training_goal='Tenant isolation',
        preferred_style='Private',
    )
    return company, store, trainer, student


def test_company_a_trainer_cannot_see_company_b_student(
    api_client,
    trainer_user,
):
    _, _, _, company_b_student = _second_tenant()
    api_client.force_authenticate(trainer_user)

    response = api_client.get('/api/students/')

    assert response.status_code == 200
    visible_ids = {
        item['user']['id'] for item in response.data['data']['items']
    }
    assert company_b_student.id not in visible_ids


def test_company_b_cannot_see_course_created_by_company_a(
    api_client,
    company_admin_user,
):
    _, _, company_b_trainer, _ = _second_tenant()
    api_client.force_authenticate(company_admin_user)
    created = api_client.post(
        '/api/course-templates/',
        {
            'name': 'Company A Private Course',
            'category': 'private',
            'duration_minutes': 60,
            'max_capacity': 1,
            'difficulty': 'beginner',
            'description': 'Tenant A only',
            'status': 'active',
        },
        format='json',
    )
    assert created.status_code == 201
    course_id = created.data['data']['id']

    api_client.force_authenticate(company_b_trainer)
    response = api_client.get('/api/course-templates/')

    assert response.status_code == 200
    visible_ids = {item['id'] for item in response.data['data']['items']}
    assert course_id not in visible_ids
