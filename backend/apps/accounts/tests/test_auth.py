"""Authentication contract tests."""

from datetime import date

from django.test import override_settings
from rest_framework.test import APITestCase

from core.constants import UserRole

from apps.companies.models import Company

from ..models import User


@override_settings(ALLOWED_HOSTS=['testserver'])
class AuthenticationAPITests(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(
            name='Test Company',
            contact_person='Tester',
            contact_phone='13900000000',
            contract_start=date(2026, 1, 1),
            contract_end=date(2026, 12, 31),
        )
        self.user = User.objects.create_user(
            phone='13900000000',
            password='StrongPass123!',
            name='测试管理员',
            role=UserRole.COMPANY_ADMIN,
            company=self.company,
        )

    def login(self, password='StrongPass123!'):
        return self.client.post(
            '/api/auth/login/',
            {'phone': self.user.phone, 'password': password},
            format='json',
        )

    def authenticate(self):
        access = self.login().data['data']['access_token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')

    def test_login_and_current_user_use_contract_envelope(self):
        response = self.login()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.data), {'code', 'message', 'data'})
        self.assertEqual(response.data['code'], 'OK')
        self.assertEqual(
            set(response.data['data']),
            {
                'access_token', 'refresh_token', 'token_type', 'expires_in',
                'refresh_expires_in', 'user',
            },
        )
        self.authenticate()
        me = self.client.get('/api/auth/me/')
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.data['data']['phone'], self.user.phone)

    def test_invalid_credentials_do_not_reveal_phone_existence(self):
        wrong_password = self.login('wrong-password')
        missing_phone = self.client.post(
            '/api/auth/login/',
            {'phone': '13800000000', 'password': 'wrong-password'},
            format='json',
        )
        for response in (wrong_password, missing_phone):
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.data['code'], 'INVALID_CREDENTIALS')
            self.assertEqual(response.data['errors'], {})
            self.assertTrue(response.data['request_id'].startswith('req_'))

    def test_disabled_account_is_rejected(self):
        self.user.is_active = False
        self.user.save(update_fields=['is_active'])
        response = self.login()
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['code'], 'ACCOUNT_DISABLED')

    def test_missing_and_invalid_access_tokens_are_uniform(self):
        missing = self.client.get('/api/auth/me/')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid')
        invalid = self.client.get('/api/auth/me/')
        for response in (missing, invalid):
            self.assertEqual(response.status_code, 401)
            self.assertEqual(set(response.data), {'code', 'message', 'errors', 'request_id'})
            self.assertEqual(response.data['code'], 'UNAUTHORIZED')

    def test_refresh_rotates_and_blacklists_old_token(self):
        refresh_token = self.login().data['data']['refresh_token']
        first = self.client.post(
            '/api/auth/refresh/', {'refresh_token': refresh_token}, format='json'
        )
        self.assertEqual(first.status_code, 200)
        self.assertNotEqual(first.data['data']['refresh_token'], refresh_token)
        second = self.client.post(
            '/api/auth/refresh/', {'refresh_token': refresh_token}, format='json'
        )
        self.assertEqual(second.status_code, 401)
        self.assertEqual(second.data['code'], 'REFRESH_TOKEN_INVALID')

    def test_logout_blacklists_refresh_token(self):
        tokens = self.login().data['data']
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {tokens['access_token']}"
        )
        logout = self.client.post(
            '/api/auth/logout/',
            {'refresh_token': tokens['refresh_token']},
            format='json',
        )
        self.assertEqual(logout.status_code, 200)
        self.assertEqual(logout.data, {
            'code': 'OK', 'message': '退出登录成功', 'data': None,
        })
        self.client.credentials()
        refresh = self.client.post(
            '/api/auth/refresh/',
            {'refresh_token': tokens['refresh_token']},
            format='json',
        )
        self.assertEqual(refresh.status_code, 401)
        self.assertEqual(refresh.data['code'], 'REFRESH_TOKEN_INVALID')

    def test_logout_rejects_another_users_refresh_token(self):
        other = User.objects.create_user(
            phone='13800000000', password='StrongPass123!', name='其他用户',
            role=UserRole.TRAINER, company=self.company,
        )
        other_tokens = self.client.post(
            '/api/auth/login/',
            {'phone': other.phone, 'password': 'StrongPass123!'},
            format='json',
        ).data['data']
        self.authenticate()
        response = self.client.post(
            '/api/auth/logout/',
            {'refresh_token': other_tokens['refresh_token']},
            format='json',
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['code'], 'REFRESH_TOKEN_INVALID')

    def test_password_change_invalidates_old_password(self):
        self.authenticate()
        wrong = self.client.post(
            '/api/auth/change-password/',
            {'old_password': 'wrong', 'new_password': 'NewStrongPass456!'},
            format='json',
        )
        self.assertEqual(wrong.status_code, 400)
        self.assertEqual(wrong.data['code'], 'OLD_PASSWORD_INCORRECT')
        changed = self.client.post(
            '/api/auth/change-password/',
            {'old_password': 'StrongPass123!', 'new_password': 'NewStrongPass456!'},
            format='json',
        )
        self.assertEqual(changed.status_code, 200)
        self.client.credentials()
        self.assertEqual(self.login().status_code, 401)
        self.assertEqual(self.login('NewStrongPass456!').status_code, 200)
