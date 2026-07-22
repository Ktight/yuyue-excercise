from datetime import date, timedelta

from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.companies.models import Company, Store
from core.constants import UserRole

from .models import BodyAssessment, StudentProfile


@override_settings(ALLOWED_HOSTS=['testserver'])
class MemberTenantAPITests(APITestCase):
    def setUp(self):
        self.company_a = self.make_company('Company A', '13800000001')
        self.company_b = self.make_company('Company B', '13800000002')
        self.store_a = self.make_store(self.company_a, 'Store A')
        self.store_b = self.make_store(self.company_b, 'Store B')
        self.trainer_a = self.make_user(
            '13900000001', UserRole.TRAINER, self.company_a, self.store_a
        )
        self.trainer_b = self.make_user(
            '13900000002', UserRole.TRAINER, self.company_b, self.store_b
        )
        self.manager_a = self.make_user(
            '13900000003', UserRole.STORE_MANAGER, self.company_a, self.store_a
        )
        self.admin_a = self.make_user(
            '13900000004', UserRole.COMPANY_ADMIN, self.company_a, None
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
    def make_user(phone, role, company, store):
        return User.objects.create_user(
            phone=phone,
            password='StrongPass123!',
            name=role,
            role=role,
            company=company,
            store=store,
        )

    def student_payload(self):
        today = timezone.localdate()
        return {
            'user': {
                'name': 'Student A',
                'phone': '13800000000',
                'password': 'StudentPass123!',
            },
            'home_store': self.store_a.id,
            'gender': 'female',
            'birth_date': '2000-01-01',
            'emergency_contact': 'Family',
            'member_card_type': 'count',
            'member_card_start': str(today),
            'member_card_expire': str(today + timedelta(days=5)),
            'member_card_balance': 3,
            'health_notes': '无',
            'injury_history': '无',
            'contraindications': '无',
            'training_goal': '改善体态',
            'preferred_style': '私教',
        }

    def test_trainer_creates_student_and_filters_expiring_membership(self):
        self.client.force_authenticate(self.trainer_a)
        created = self.client.post('/api/students/', self.student_payload(), format='json')

        self.assertEqual(created.status_code, 201)
        profile = StudentProfile.objects.get()
        self.assertEqual(profile.user.role, UserRole.STUDENT)
        self.assertEqual(profile.primary_trainer, self.trainer_a)
        response = self.client.get('/api/students/?expiring_days=7')
        self.assertEqual(response.data['data']['total'], 1)

    def test_other_company_trainer_cannot_read_student_or_assessments(self):
        self.client.force_authenticate(self.trainer_a)
        self.client.post('/api/students/', self.student_payload(), format='json')
        profile = StudentProfile.objects.get()

        self.client.force_authenticate(self.trainer_b)
        detail = self.client.get(f'/api/students/{profile.id}/')
        assessments = self.client.get(
            f'/api/students/{profile.id}/assessments/'
        )

        self.assertEqual(detail.status_code, 404)
        self.assertEqual(assessments.status_code, 404)
        self.assertEqual(detail.data['code'], 'NOT_FOUND')

    def test_membership_eligibility_and_manager_update(self):
        self.client.force_authenticate(self.trainer_a)
        self.client.post('/api/students/', self.student_payload(), format='json')
        profile = StudentProfile.objects.get()

        eligibility = self.client.get(f'/api/students/{profile.id}/eligibility/')
        self.assertTrue(eligibility.data['data']['is_eligible'])
        denied = self.client.patch(
            f'/api/students/{profile.id}/membership/',
            {'active': False},
            format='json',
        )
        self.assertEqual(denied.status_code, 403)

        self.client.force_authenticate(self.manager_a)
        updated = self.client.patch(
            f'/api/students/{profile.id}/membership/',
            {'active': False},
            format='json',
        )
        self.assertEqual(updated.status_code, 200)
        eligibility = self.client.get(f'/api/students/{profile.id}/eligibility/')
        self.assertEqual(
            eligibility.data['data']['reason_code'], 'MEMBERSHIP_SUSPENDED'
        )

    def test_assessment_validation_media_and_delete_permissions(self):
        self.client.force_authenticate(self.trainer_a)
        self.client.post('/api/students/', self.student_payload(), format='json')
        profile = StudentProfile.objects.get()
        invalid = self.client.post(
            '/api/body-assessments/',
            {
                'student': profile.id,
                'assess_date': str(timezone.localdate() + timedelta(days=1)),
                'flexibility_score': 11,
            },
            format='json',
        )
        self.assertEqual(invalid.status_code, 400)
        self.assertIn('assess_date', invalid.data['errors'])
        self.assertIn('flexibility_score', invalid.data['errors'])

        created = self.client.post(
            '/api/body-assessments/',
            {
                'student': profile.id,
                'assess_date': str(timezone.localdate()),
                'height': 168.5,
                'photos': ['https://client.invalid/photo.jpg'],
            },
            format='json',
        )
        self.assertEqual(created.status_code, 201)
        assessment = BodyAssessment.objects.get()
        self.assertEqual(assessment.photos, [])
        denied = self.client.delete(f'/api/body-assessments/{assessment.id}/')
        self.assertEqual(denied.status_code, 403)

        self.client.force_authenticate(self.admin_a)
        deleted = self.client.delete(f'/api/body-assessments/{assessment.id}/')
        self.assertEqual(deleted.status_code, 200)
        self.assertFalse(BodyAssessment.objects.filter(pk=assessment.id).exists())
