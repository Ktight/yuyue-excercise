from datetime import date

from django.test import override_settings
from rest_framework.test import APITestCase

from apps.accounts.models import User
from core.constants import UserRole

from .models import Company, Room, Store


@override_settings(ALLOWED_HOSTS=['testserver'])
class OrganizationTenantAPITests(APITestCase):
    def setUp(self):
        self.company_a = self.make_company('Company A', '13800000001')
        self.company_b = self.make_company('Company B', '13800000002')
        self.store_a = self.make_store(self.company_a, 'Store A')
        self.store_b = self.make_store(self.company_b, 'Store B')
        self.room_a = Room.objects.create(store=self.store_a, name='Room A')
        self.room_b = Room.objects.create(store=self.store_b, name='Room B')
        self.admin_a = self.make_user(
            '13900000001', UserRole.COMPANY_ADMIN, self.company_a
        )
        self.manager_a = self.make_user(
            '13900000002', UserRole.STORE_MANAGER, self.company_a, self.store_a
        )

    @staticmethod
    def make_company(name, phone):
        return Company.objects.create(
            name=name,
            contact_person='Admin',
            contact_phone=phone,
            contract_start=date(2026, 1, 1),
            contract_end=date(2027, 1, 1),
        )

    @staticmethod
    def make_store(company, name):
        return Store.objects.create(
            company=company,
            name=name,
            address='Test address',
            phone='021-60000000',
            business_hours='07:00-22:00',
        )

    @staticmethod
    def make_user(phone, role, company, store=None):
        return User.objects.create_user(
            phone=phone,
            password='StrongPass123!',
            name=role,
            role=role,
            company=company,
            store=store,
        )

    def test_store_list_defaults_to_current_company(self):
        self.client.force_authenticate(self.admin_a)
        response = self.client.get('/api/stores/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['total'], 1)
        self.assertEqual(response.data['data']['items'][0]['id'], self.store_a.id)

    def test_cross_tenant_store_detail_is_hidden(self):
        self.client.force_authenticate(self.admin_a)
        response = self.client.get(f'/api/stores/{self.store_b.id}/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['code'], 'NOT_FOUND')

    def test_store_manager_cannot_create_room_for_other_company(self):
        self.client.force_authenticate(self.manager_a)
        response = self.client.post(
            '/api/rooms/',
            {'store': self.store_b.id, 'name': 'Cross tenant'},
            format='json',
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['code'], 'FORBIDDEN')
        self.assertIn('request_id', response.data)

    def test_detail_success_uses_contract_envelope(self):
        self.client.force_authenticate(self.admin_a)
        response = self.client.get(f'/api/stores/{self.store_a.id}/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.data), {'code', 'message', 'data'})
        self.assertEqual(response.data['data']['id'], self.store_a.id)
