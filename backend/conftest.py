from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.companies.models import Company, Store
from apps.members.models import StudentProfile
from core.constants import MemberCardType, UserRole


TEST_PASSWORD = 'TestPass123!'


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_company(db):
    today = timezone.localdate()
    return Company.objects.create(
        name='Core Flow Company',
        contact_person='Company Admin',
        contact_phone='13910000000',
        contract_start=today,
        contract_end=today + timedelta(days=365),
    )


@pytest.fixture
def test_store(test_company):
    return Store.objects.create(
        company=test_company,
        name='Core Flow Store',
        address='Core Flow Road 1',
        phone='021-10000000',
        business_hours='08:00-22:00',
    )


@pytest.fixture
def superadmin_user(db):
    return User.objects.create_superuser(
        phone='13910000001',
        password=TEST_PASSWORD,
        name='Super Admin',
    )


@pytest.fixture
def company_admin_user(test_company):
    return User.objects.create_user(
        phone='13910000002',
        password=TEST_PASSWORD,
        name='Company Admin',
        role=UserRole.COMPANY_ADMIN,
        company=test_company,
    )


@pytest.fixture
def trainer_user(test_company, test_store):
    return User.objects.create_user(
        phone='13910000003',
        password=TEST_PASSWORD,
        name='Trainer A',
        role=UserRole.TRAINER,
        company=test_company,
        store=test_store,
    )


@pytest.fixture
def student_user(test_company, test_store, trainer_user):
    today = timezone.localdate()
    student = User.objects.create_user(
        phone='13910000004',
        password=TEST_PASSWORD,
        name='Student A',
        role=UserRole.STUDENT,
        company=test_company,
        store=test_store,
    )
    StudentProfile.objects.create(
        user=student,
        company=test_company,
        home_store=test_store,
        primary_trainer=trainer_user,
        gender='female',
        emergency_contact='13910000005',
        member_card_type=MemberCardType.COUNT,
        member_card_start=today,
        member_card_expire=today + timedelta(days=90),
        member_card_balance=10,
        member_card_active=True,
        health_notes='',
        injury_history='',
        contraindications='',
        training_goal='Core flow coverage',
        preferred_style='Private',
    )
    return student
