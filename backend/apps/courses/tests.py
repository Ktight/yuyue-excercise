from datetime import date

from django.test import override_settings
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.companies.models import Company
from core.constants import CourseCategory, ResourceStatus, UserRole

from .models import CourseTemplate


@override_settings(ALLOWED_HOSTS=['testserver'])
class CourseTemplateAPITests(APITestCase):
    def setUp(self):
        self.company_a = self.make_company('Company A', '13800000001')
        self.company_b = self.make_company('Company B', '13800000002')
        self.admin_a = self.make_user(
            '13900000001', UserRole.COMPANY_ADMIN, self.company_a
        )
        self.trainer_a = self.make_user(
            '13900000002', UserRole.TRAINER, self.company_a
        )
        self.trainer_b = self.make_user(
            '13900000003', UserRole.TRAINER, self.company_b
        )
        self.template_a = CourseTemplate.objects.create(
            company=self.company_a,
            name='肩颈理疗私教',
            category=CourseCategory.PRIVATE,
            difficulty='beginner',
        )
        self.template_b = CourseTemplate.objects.create(
            company=self.company_b,
            name='Other tenant course',
            category=CourseCategory.GROUP,
            difficulty='advanced',
            max_capacity=20,
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
    def make_user(phone, role, company):
        return User.objects.create_user(
            phone=phone,
            password='StrongPass123!',
            name=role,
            role=role,
            company=company,
        )

    def test_trainer_list_is_read_only_and_tenant_filtered(self):
        self.client.force_authenticate(self.trainer_a)
        response = self.client.get('/api/course-templates/?status=active')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['total'], 1)
        denied = self.client.post(
            '/api/course-templates/',
            {'name': 'Denied', 'category': 'group', 'difficulty': 'beginner'},
            format='json',
        )
        self.assertEqual(denied.status_code, 403)

    def test_cross_tenant_detail_is_hidden(self):
        self.client.force_authenticate(self.trainer_a)
        response = self.client.get(
            f'/api/course-templates/{self.template_b.id}/'
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['code'], 'NOT_FOUND')

    def test_private_course_capacity_must_equal_one(self):
        self.client.force_authenticate(self.admin_a)
        response = self.client.post(
            '/api/course-templates/',
            {
                'name': 'Invalid private course',
                'category': 'private',
                'difficulty': 'beginner',
                'max_capacity': 2,
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('max_capacity', response.data['errors'])

    def test_filters_and_idempotent_status_patch(self):
        self.client.force_authenticate(self.admin_a)
        response = self.client.get(
            '/api/course-templates/?search=肩颈&category=private&difficulty=beginner'
        )
        self.assertEqual(response.data['data']['total'], 1)

        deactivate = self.client.patch(
            f'/api/course-templates/{self.template_a.id}/',
            {'status': ResourceStatus.INACTIVE},
            format='json',
        )
        self.assertEqual(deactivate.status_code, 200)
        self.assertEqual(deactivate.data['data']['status'], ResourceStatus.INACTIVE)
        second = self.client.patch(
            f'/api/course-templates/{self.template_a.id}/',
            {'status': ResourceStatus.INACTIVE},
            format='json',
        )
        self.assertEqual(second.status_code, 200)
