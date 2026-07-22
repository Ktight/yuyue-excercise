"""Tenant-aware user management contract tests."""

from datetime import date

from django.test import override_settings
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from core.constants import UserRole

from apps.companies.models import Company, Store

from ..models import User


@override_settings(ALLOWED_HOSTS=['testserver'])
class UserManagementAPITests(APITestCase):
    def make_user(self, phone, role, company_id=None, store_id=None, name='用户'):
        return User.objects.create_user(
            phone=phone,
            password='StrongPass123!',
            name=name,
            role=role,
            company_id=company_id,
            store_id=store_id,
        )

    def authenticate(self, user):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(user).access_token}'
        )

    def setUp(self):
        self.company = Company.objects.create(
            name='Company A',
            contact_person='Admin A',
            contact_phone='13900000001',
            contract_start=date(2026, 1, 1),
            contract_end=date(2026, 12, 31),
        )
        self.other_tenant = Company.objects.create(
            name='Company B',
            contact_person='Admin B',
            contact_phone='13900000002',
            contract_start=date(2026, 1, 1),
            contract_end=date(2026, 12, 31),
        )
        self.store = Store.objects.create(
            company=self.company,
            name='Main Store',
            address='Test Address',
            phone='13800000000',
            business_hours='07:00-22:00',
        )
        self.other_store = Store.objects.create(
            company=self.other_tenant,
            name='Other Store',
            address='Other Address',
            phone='13800000009',
            business_hours='07:00-22:00',
        )
        self.company_admin = self.make_user(
            '13900000001', UserRole.COMPANY_ADMIN,
            company_id=self.company.id, name='甲公司管理员'
        )
        self.same_company = self.make_user(
            '13900000002', UserRole.TRAINER,
            company_id=self.company.id, name='甲公司教练'
        )
        self.other_company = self.make_user(
            '13900000003', UserRole.TRAINER,
            company_id=self.other_tenant.id, name='乙公司教练'
        )

    def test_company_admin_list_is_tenant_filtered_and_paginated(self):
        self.authenticate(self.company_admin)
        response = self.client.get('/api/users/?page=1&page_size=1&search=教练')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.data), {'code', 'message', 'data'})
        self.assertEqual(set(response.data['data']), {'items', 'page', 'page_size', 'total'})
        self.assertEqual(response.data['data']['total'], 1)
        self.assertEqual(response.data['data']['items'][0]['id'], self.same_company.id)

    def test_non_admin_roles_are_forbidden(self):
        for index, role in enumerate(
            [UserRole.STORE_MANAGER, UserRole.TRAINER, UserRole.STUDENT], start=4
        ):
            user = self.make_user(
                f'1390000000{index}', role, company_id=self.company.id,
                store_id=self.store.id if role == UserRole.STORE_MANAGER else None,
            )
            self.authenticate(user)
            response = self.client.get('/api/users/')
            self.assertEqual(response.status_code, 403)
            self.assertEqual(response.data['code'], 'FORBIDDEN')

    def test_create_user_sets_initial_password_and_company(self):
        self.authenticate(self.company_admin)
        response = self.client.post(
            '/api/users/',
            {
                'phone': '13800000000',
                'name': '新教练',
                'password': 'ChangeMe123!',
                'role': UserRole.TRAINER,
                'store_id': None,
                'is_active': True,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        created = User.objects.get(phone='13800000000')
        self.assertEqual(created.company_id, self.company_admin.company_id)
        self.assertTrue(created.check_password('ChangeMe123!'))
        self.assertNotIn('password', response.data['data'])

    def test_duplicate_phone_is_conflict(self):
        self.authenticate(self.company_admin)
        response = self.client.post(
            '/api/users/',
            {
                'phone': self.same_company.phone,
                'name': '重复用户',
                'password': 'ChangeMe123!',
                'role': UserRole.TRAINER,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.data['code'], 'PHONE_ALREADY_EXISTS')

    def test_store_role_rules(self):
        self.authenticate(self.company_admin)
        manager_without_store = self.client.post(
            '/api/users/',
            {
                'phone': '13800000001', 'name': '经理',
                'password': 'ChangeMe123!', 'role': UserRole.STORE_MANAGER,
            },
            format='json',
        )
        self.assertEqual(manager_without_store.status_code, 400)
        trainer_without_store = self.client.post(
            '/api/users/',
            {
                'phone': '13800000002', 'name': '教练',
                'password': 'ChangeMe123!', 'role': UserRole.TRAINER,
            },
            format='json',
        )
        self.assertEqual(trainer_without_store.status_code, 201)
        forbidden_store = self.client.post(
            '/api/users/',
            {
                'phone': '13800000003', 'name': '公司管理员',
                'password': 'ChangeMe123!', 'role': UserRole.COMPANY_ADMIN,
                'store_id': self.store.id,
            },
            format='json',
        )
        self.assertEqual(forbidden_store.status_code, 400)

    def test_create_rejects_store_from_another_tenant(self):
        self.authenticate(self.company_admin)
        response = self.client.post(
            '/api/users/',
            {
                'phone': '13800000008',
                'name': 'Cross tenant manager',
                'password': 'ChangeMe123!',
                'role': UserRole.STORE_MANAGER,
                'store_id': self.other_store.id,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('store_id', response.data['errors'])

    def test_cross_tenant_detail_is_hidden_as_not_found(self):
        self.authenticate(self.company_admin)
        response = self.client.get(f'/api/users/{self.other_company.id}/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['code'], 'USER_NOT_FOUND')

    def test_role_change_clears_store_in_one_update(self):
        manager = self.make_user(
            '13800000004', UserRole.STORE_MANAGER,
            company_id=self.company.id, store_id=self.store.id
        )
        self.authenticate(self.company_admin)
        response = self.client.patch(
            f'/api/users/{manager.id}/',
            {'role': UserRole.TRAINER, 'store_id': None},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        manager.refresh_from_db()
        self.assertIsNone(manager.store_id)

    def test_super_admin_can_see_all_tenants(self):
        super_admin = self.make_user('13900000009', UserRole.SUPER_ADMIN)
        self.authenticate(super_admin)
        response = self.client.get('/api/users/?ordering=-id')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['total'], User.objects.count())

    def test_company_admin_can_reset_managed_users_password(self):
        self.authenticate(self.company_admin)
        response = self.client.post(
            f'/api/users/{self.same_company.id}/reset-password/',
            {'new_password': 'ResetPass456!'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.same_company.refresh_from_db()
        self.assertTrue(self.same_company.check_password('ResetPass456!'))

    def test_reset_password_hides_cross_tenant_user(self):
        self.authenticate(self.company_admin)
        response = self.client.post(
            f'/api/users/{self.other_company.id}/reset-password/',
            {'new_password': 'ResetPass456!'},
            format='json',
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['code'], 'USER_NOT_FOUND')
