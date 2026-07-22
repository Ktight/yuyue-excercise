from datetime import date, time, timedelta

from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.companies.models import Company, Room, Store
from apps.members.models import StudentProfile
from core.constants import (
    CourseCategory,
    MemberCardType,
    ResourceStatus,
    UserRole,
)

from .models import CourseBooking, CourseSchedule, CourseTemplate


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


@override_settings(ALLOWED_HOSTS=['testserver'])
class StudentScheduleDiscoveryAPITests(APITestCase):
    def setUp(self):
        today = timezone.localdate()
        self.company = CourseTemplateAPITests.make_company(
            'Discovery Company',
            '13800000101',
        )
        self.other_company = CourseTemplateAPITests.make_company(
            'Other Company',
            '13800000102',
        )
        self.store = self.make_store(self.company, 'Discovery Store')
        self.other_store = self.make_store(self.other_company, 'Other Store')
        self.room = Room.objects.create(
            store=self.store,
            name='Room A',
            capacity=10,
            facilities={},
        )
        self.other_room = Room.objects.create(
            store=self.other_store,
            name='Room B',
            capacity=10,
            facilities={},
        )
        self.trainer = self.make_user(
            '13900000101', UserRole.TRAINER, self.company, self.store
        )
        self.other_trainer = self.make_user(
            '13900000102',
            UserRole.TRAINER,
            self.other_company,
            self.other_store,
        )
        self.student = self.make_user(
            '13900000103', UserRole.STUDENT, self.company, self.store
        )
        self.student_profile = StudentProfile.objects.create(
            company=self.company,
            user=self.student,
            home_store=self.store,
            primary_trainer=self.trainer,
            gender='female',
            birth_date=date(2000, 1, 1),
            emergency_contact='Contact',
            member_card_type=MemberCardType.COUNT,
            member_card_start=today - timedelta(days=1),
            member_card_expire=today + timedelta(days=30),
            member_card_balance=3,
            health_notes='',
            injury_history='',
            contraindications='',
            training_goal='Mobility',
            preferred_style='Group',
        )
        self.other_students = [
            self.make_user(
                f'1390000011{index}',
                UserRole.STUDENT,
                self.company,
                self.store,
            )
            for index in range(2)
        ]
        self.template = CourseTemplate.objects.create(
            company=self.company,
            name='Discovery Course',
            category=CourseCategory.GROUP,
            difficulty='beginner',
            max_capacity=10,
        )
        self.other_template = CourseTemplate.objects.create(
            company=self.other_company,
            name='Other Course',
            category=CourseCategory.GROUP,
            difficulty='beginner',
            max_capacity=10,
        )
        self.available = self.make_schedule(today + timedelta(days=1), capacity=3)
        CourseBooking.objects.create(
            company=self.company,
            schedule=self.available,
            student=self.other_students[0],
            status='booked',
        )
        CourseBooking.objects.create(
            company=self.company,
            schedule=self.available,
            student=self.other_students[1],
            status='cancelled',
        )

        full = self.make_schedule(today + timedelta(days=2), capacity=1)
        CourseBooking.objects.create(
            company=self.company,
            schedule=full,
            student=self.other_students[0],
            status='booked',
        )
        self.make_schedule(
            today + timedelta(days=3),
            booking_deadline=timezone.now() - timedelta(minutes=1),
        )
        self.make_schedule(today + timedelta(days=4), status='cancelled')
        previously_booked = self.make_schedule(today + timedelta(days=5))
        CourseBooking.objects.create(
            company=self.company,
            schedule=previously_booked,
            student=self.student,
            status='cancelled',
        )
        CourseSchedule.objects.create(
            company=self.other_company,
            store=self.other_store,
            room=self.other_room,
            course_template=self.other_template,
            trainer=self.other_trainer,
            course_date=today + timedelta(days=1),
            start_time=time(10),
            end_time=time(11),
            capacity=5,
            status='published',
        )

    @staticmethod
    def make_store(company, name):
        return Store.objects.create(
            company=company,
            name=name,
            address='Address',
            phone='021-60000101',
            business_hours='09:00-18:00',
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

    def make_schedule(self, course_date, capacity=5, status='published', **extra):
        return CourseSchedule.objects.create(
            company=self.company,
            store=self.store,
            room=self.room,
            course_template=self.template,
            trainer=self.trainer,
            course_date=course_date,
            start_time=time(10),
            end_time=time(11),
            capacity=capacity,
            status=status,
            **extra,
        )

    def test_student_sees_only_bookable_tenant_schedules(self):
        self.client.force_authenticate(self.student)
        response = self.client.get('/api/schedules/', {'status': 'published'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['total'], 1)
        item = response.data['data']['items'][0]
        self.assertEqual(item['id'], self.available.id)
        self.assertEqual(item['bookings_count'], 1)
        self.assertEqual(item['remaining_capacity'], 2)

        booked = self.client.post(
            f'/api/schedules/{self.available.id}/book/',
            {},
            format='json',
        )
        self.assertEqual(booked.status_code, 201)
        refreshed = self.client.get('/api/schedules/')
        self.assertEqual(refreshed.data['data']['total'], 0)

    def test_ineligible_student_has_no_discovery_results(self):
        self.student_profile.member_card_balance = 0
        self.student_profile.save(update_fields=['member_card_balance'])
        self.client.force_authenticate(self.student)

        response = self.client.get('/api/schedules/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['total'], 0)
