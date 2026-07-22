from datetime import date, time
from io import BytesIO
from pathlib import Path
import shutil

from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.attendance.models import Attendance
from apps.companies.models import Company, Room, Store
from apps.courses.models import CourseBooking, CourseSchedule, CourseTemplate

from .models import ClassRecord


TEST_MEDIA_ROOT = Path(settings.BASE_DIR) / '.phase8_test_media'


class PhaseEightAPITests(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(
            name='Phase 8',
            contact_person='Owner',
            contact_phone='13800000000',
            contract_start=date(2026, 1, 1),
            contract_end=date(2026, 12, 31),
            status='active',
        )
        self.store = Store.objects.create(
            company=self.company,
            name='Store',
            address='Address',
            phone='13800000001',
            business_hours='09:00-18:00',
            status='active',
        )
        self.room = Room.objects.create(
            store=self.store,
            name='Room',
            capacity=12,
            facilities={},
            status='active',
        )
        self.trainer = User.objects.create_user(
            phone='13800000002',
            name='Trainer',
            role='trainer',
            company=self.company,
            store=self.store,
        )
        self.manager = User.objects.create_user(
            phone='13800000003',
            name='Manager',
            role='company_admin',
            company=self.company,
        )
        self.students = [
            User.objects.create_user(
                phone=f'1390000000{index}',
                name=f'Student {index}',
                role='student',
                company=self.company,
                store=self.store,
            )
            for index in range(1, 9)
        ]
        self.course = CourseTemplate.objects.create(
            company=self.company,
            name='Group',
            category='group',
            duration_minutes=60,
            max_capacity=8,
            difficulty='beginner',
            status='active',
        )
        self.schedule = self._schedule(date(2026, 7, 22), capacity=8)
        self.poses = {
            'warmup': [{'name': 'Warmup', 'duration': 5}],
            'main': [{'name': 'Main', 'duration': 30}],
            'cooldown': [{'name': 'Cooldown', 'duration': 5}],
        }

    def tearDown(self):
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def _schedule(self, course_date, capacity=1):
        return CourseSchedule.objects.create(
            company=self.company,
            store=self.store,
            room=self.room,
            course_template=self.course,
            trainer=self.trainer,
            course_date=course_date,
            start_time=time(10, 0),
            end_time=time(11, 0),
            capacity=capacity,
            schedule_mode='single',
            status='completed',
        )

    def _attendance(self, schedule, student, status='present'):
        booking = CourseBooking.objects.create(
            company=self.company,
            schedule=schedule,
            student=student,
            status='booked',
        )
        return Attendance.objects.create(
            company=self.company,
            booking=booking,
            schedule=schedule,
            student=student,
            status=status,
            checked_by=self.trainer,
        )

    def test_single_record_media_history_and_completion(self):
        attendance = self._attendance(self.schedule, self.students[0])
        self.client.force_authenticate(self.trainer)
        response = self.client.post(
            '/api/class-records/',
            {
                'attendance_id': attendance.id,
                'theme': 'Core',
                'pose_sequence': self.poses,
                'completion_rating': 5,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        record_id = response.data['data']['id']
        self.assertEqual(response.data['data']['attendance_status'], 'present')
        self.assertEqual(response.data['data']['pose_sequence'], self.poses)

        media = self.client.post(
            f'/api/class-records/{record_id}/media/',
            {
                'media_type': 'image',
                'file_url': 'https://example.com/class.jpg',
                'annotations': {'points': []},
            },
            format='json',
        )
        self.assertEqual(media.status_code, 201)
        invalid_media = self.client.post(
            f'/api/class-records/{record_id}/media/',
            {
                'media_type': 'image',
                'file_url': 'https://example.com/class.jpg',
                'annotations': ['not-an-object'],
            },
            format='json',
        )
        self.assertEqual(invalid_media.status_code, 400)
        history = self.client.get(
            '/api/class-records/',
            {'student_id': self.students[0].id, 'date_range': '2026-07-01,2026-07-31'},
        )
        self.assertEqual(history.data['data']['total'], 1)
        completed = self.client.post(
            f'/api/class-records/{record_id}/complete/',
            {},
            format='json',
        )
        self.assertEqual(completed.data['data']['status'], 'completed')
        self.assertEqual(
            self.client.post(
                f'/api/class-records/{record_id}/media/',
                {
                    'media_type': 'image',
                    'file_url': 'https://example.com/late.jpg',
                },
                format='json',
            ).status_code,
            409,
        )
        self.assertEqual(
            self.client.patch(
                f'/api/class-records/{record_id}/',
                {'trainer_notes': 'Too late'},
                format='json',
            ).status_code,
            409,
        )

    def test_batch_overrides_and_atomic_rollback(self):
        attendances = [
            self._attendance(
                self.schedule,
                student,
                status='late' if index == 7 else 'present',
            )
            for index, student in enumerate(self.students)
        ]
        self.client.force_authenticate(self.trainer)
        response = self.client.post(
            '/api/training/batch-records/',
            {
                'schedule_id': self.schedule.id,
                'common_data': {
                    'theme': 'Group core',
                    'pose_sequence': self.poses,
                    'trainer_notes': 'Common',
                    'homework': 'Practice',
                },
                'student_overrides': {
                    str(self.students[2].id): {'completion_rating': 4},
                    str(self.students[4].id): {'completion_rating': 3},
                },
            },
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['data']['created_count'], 8)
        records = ClassRecord.objects.filter(schedule=self.schedule)
        self.assertEqual(records.count(), 8)
        self.assertTrue(all(record.pose_sequence == self.poses for record in records))
        self.assertEqual(records.get(student=self.students[2]).completion_rating, 4)
        self.assertEqual(records.get(student=self.students[4]).completion_rating, 3)

        second_schedule = self._schedule(date(2026, 7, 23), capacity=2)
        second_attendances = [
            self._attendance(second_schedule, student)
            for student in self.students[:2]
        ]
        ClassRecord.objects.create(
            company=self.company,
            attendance=second_attendances[1],
            schedule=second_schedule,
            student=self.students[1],
            trainer=self.trainer,
            store=self.store,
            class_date=second_schedule.course_date,
            theme='Existing',
            pose_sequence=self.poses,
        )
        failed = self.client.post(
            '/api/training/batch-records/',
            {
                'schedule_id': second_schedule.id,
                'common_data': {'theme': 'Rollback', 'pose_sequence': self.poses},
                'student_overrides': {},
            },
            format='json',
        )
        self.assertEqual(failed.status_code, 409)
        self.assertEqual(ClassRecord.objects.filter(schedule=second_schedule).count(), 1)
        self.assertEqual(attendances[-1].status, 'late')

    def test_template_and_record_permissions(self):
        attendance = self._attendance(self.schedule, self.students[0])
        self.client.force_authenticate(self.manager)
        template = self.client.post(
            '/api/class-templates/',
            {
                'trainer': self.trainer.id,
                'name': 'Shared',
                'scope': 'company_shared',
                'course_template': self.course.id,
                'pose_sequence': self.poses,
            },
            format='json',
        )
        self.assertEqual(template.status_code, 201)
        self.assertEqual(
            self.client.post(
                '/api/class-records/',
                {
                    'attendance_id': attendance.id,
                    'theme': 'Denied',
                    'pose_sequence': self.poses,
                },
                format='json',
            ).status_code,
            403,
        )
        self.client.force_authenticate(self.trainer)
        self.assertEqual(
            self.client.get('/api/class-templates/', {'scope': 'company_shared'}).data['data']['total'],
            1,
        )
        self.assertEqual(
            self.client.post(
                '/api/class-templates/',
                {
                    'trainer': self.trainer.id,
                    'name': 'Denied',
                    'scope': 'personal',
                    'pose_sequence': self.poses,
                },
                format='json',
            ).status_code,
            403,
        )

    @override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
    def test_image_upload_thumbnail_limit_and_role(self):
        image = Image.new('RGB', (640, 480), 'blue')
        payload = BytesIO()
        image.save(payload, format='PNG')
        self.client.force_authenticate(self.trainer)
        response = self.client.post(
            '/api/upload/',
            {
                'file': SimpleUploadedFile(
                    'lesson.png',
                    payload.getvalue(),
                    content_type='image/png',
                ),
                'media_type': 'image',
            },
            format='multipart',
        )
        self.assertEqual(response.status_code, 201)
        thumbnail_url = response.data['data']['thumbnail_url']
        thumbnail_path = TEST_MEDIA_ROOT / thumbnail_url.split('/media/', 1)[1]
        with Image.open(thumbnail_path) as thumbnail:
            self.assertEqual(thumbnail.size, (300, 225))

        oversized = SimpleUploadedFile(
            'large.mp4',
            b'x' * (10 * 1024 * 1024 + 1),
            content_type='video/mp4',
        )
        self.assertEqual(
            self.client.post(
                '/api/upload/',
                {'file': oversized, 'media_type': 'video'},
                format='multipart',
            ).status_code,
            400,
        )
        self.client.force_authenticate(self.students[0])
        self.assertEqual(
            self.client.post(
                '/api/upload/',
                {
                    'file': SimpleUploadedFile(
                        'lesson.png', payload.getvalue(), content_type='image/png'
                    ),
                    'media_type': 'image',
                },
                format='multipart',
            ).status_code,
            403,
        )
