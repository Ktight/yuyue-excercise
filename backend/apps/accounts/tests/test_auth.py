from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken


pytestmark = pytest.mark.django_db


def test_login_success_returns_tokens_and_user(api_client, company_admin_user):
    response = api_client.post(
        '/api/auth/login/',
        {
            'phone': company_admin_user.phone,
            'password': 'TestPass123!',
        },
        format='json',
    )

    assert response.status_code == 200
    assert response.data['code'] == 'OK'
    assert response.data['data']['access_token']
    assert response.data['data']['refresh_token']
    assert response.data['data']['user']['id'] == company_admin_user.id


def test_login_failure_rejects_invalid_password(api_client, company_admin_user):
    response = api_client.post(
        '/api/auth/login/',
        {
            'phone': company_admin_user.phone,
            'password': 'incorrect-password',
        },
        format='json',
    )

    assert response.status_code == 401
    assert response.data['code'] == 'INVALID_CREDENTIALS'


def test_expired_access_token_is_rejected(api_client, company_admin_user):
    token = AccessToken.for_user(company_admin_user)
    token.set_exp(
        from_time=timezone.now(),
        lifetime=timedelta(seconds=-1),
    )
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    response = api_client.get('/api/auth/me/')

    assert response.status_code == 401
    assert response.data['code'] == 'UNAUTHORIZED'


def test_role_permissions_protect_management_apis(
    api_client,
    company_admin_user,
    trainer_user,
    student_user,
):
    api_client.force_authenticate(company_admin_user)
    admin_response = api_client.get('/api/users/')
    assert admin_response.status_code == 200

    api_client.force_authenticate(trainer_user)
    trainer_admin_response = api_client.get('/api/users/')
    trainer_student_response = api_client.get('/api/students/')
    assert trainer_admin_response.status_code == 403
    assert trainer_student_response.status_code == 200

    api_client.force_authenticate(student_user)
    student_response = api_client.get('/api/students/')
    assert student_response.status_code == 403
