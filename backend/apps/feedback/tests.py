from datetime import time, timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.attendance.models import Attendance
from apps.companies.models import Company, Room, Store
from apps.courses.models import CourseBooking, CourseSchedule, CourseTemplate
from apps.members.models import BodyAssessment, StudentProfile
from apps.training.models import ClassRecord, TrainingPlan

from .models import StudentFeedback


class PhaseTenAPITests(APITestCase):
    def setUp(self):
        self.today = timezone.localdate()
        self.start = self.today - timedelta(days=27)
        self.company = Company.objects.create(
            name='Phase 10',
            contact_person='Owner',
            contact_phone='13800000000',
            contract_start=self.start,
            contract_end=self.today + timedelta(days=365),
            status='active',
        )
        self.other_company = Company.objects.create(
            name='Other tenant',
            contact_person='Other owner',
            contact_phone='13800000008',
            contract_start=self.start,
            contract_end=self.today + timedelta(days=365),
            status='active',
        )
        self.store = Store.objects.create(
            company=self.company,
            name='Main store',
            address='Address',
            phone='13800000001',
            business_hours='09:00-21:00',
            status='active',
        )
        self.room = Room.objects.create(
            store=self.store,
            name='Room',
            capacity=1,
            facilities={},
            status='active',
        )
        self.trainer = self._user(
            '13800000002', 'Trainer', 'trainer', self.store
        )
        self.other_trainer = self._user(
            '13800000003', 'Other trainer', 'trainer', self.store
        )
        self.manager = self._user(
            '13800000004', 'Manager', 'store_manager', self.store
        )
        self.admin = self._user(
            '13800000005', 'Admin', 'company_admin'
        )
        self.student = self._user(
            '13800000006', 'Student', 'student', self.store
        )
        self.other_student = self._user(
            '13800000007', 'Other student', 'student', self.store
        )
        self.other_admin = User.objects.create_user(
            phone='13800000008',
            name='Other admin',
            role='company_admin',
            company=self.other_company,
        )
        self.super_admin = User.objects.create_user(
            phone='13800000009',
            name='Super admin',
            role='super_admin',
        )
        self.profile = self._profile(self.student, self.trainer)
        self.other_profile = self._profile(
            self.other_student,
            self.other_trainer,
        )
        self.course = CourseTemplate.objects.create(
            company=self.company,
            name='Private',
            category='private',
            duration_minutes=60,
            max_capacity=1,
            difficulty='beginner',
            status='active',
        )
        self.poses = {'warmup': [], 'main': [], 'cooldown': []}

    def _user(self, phone, name, role, store=None):
        return User.objects.create_user(
            phone=phone,
            name=name,
            role=role,
            company=self.company,
            store=store,
        )

    def _profile(self, user, trainer):
        return StudentProfile.objects.create(
            company=self.company,
            user=user,
            home_store=self.store,
            primary_trainer=trainer,
            gender='female',
            emergency_contact='Contact',
            member_card_type='count',
            member_card_start=self.start,
            member_card_expire=self.today + timedelta(days=365),
            member_card_balance=20,
            health_notes='',
            injury_history='',
            contraindications='',
            training_goal='Core',
            preferred_style='Pilates',
        )

    def _record(self, index, status='completed', student=None):
        student = student or self.student
        trainer = (
            self.trainer if student == self.student else self.other_trainer
        )
        class_date = self.start + timedelta(days=index * 3)
        schedule = CourseSchedule.objects.create(
            company=self.company,
            store=self.store,
            room=self.room,
            course_template=self.course,
            trainer=trainer,
            course_date=class_date,
            start_time=time(10, 0),
            end_time=time(11, 0),
            capacity=1,
            status='completed',
        )
        booking = CourseBooking.objects.create(
            company=self.company,
            schedule=schedule,
            student=student,
            status='booked',
        )
        attendance = Attendance.objects.create(
            company=self.company,
            booking=booking,
            schedule=schedule,
            student=student,
            checked_by=trainer,
            status='absent' if index == 7 else 'present',
        )
        return ClassRecord.objects.create(
            company=self.company,
            attendance=attendance,
            schedule=schedule,
            student=student,
            trainer=trainer,
            store=self.store,
            class_date=class_date,
            theme=f'Session {index + 1}',
            pose_sequence=self.poses,
            trainer_notes=f'Comment {index + 1}',
            completion_rating=(index % 5) + 1,
            status=status,
        )

    def test_feedback_create_scope_state_duplicate_and_immutable(self):
        draft = self._record(0, status='draft')
        self.client.force_authenticate(self.student)
        draft_response = self.client.post(
            '/api/feedback/',
            {'class_record': draft.id, 'feeling': 'moderate'},
            format='json',
        )
        self.assertEqual(draft_response.status_code, 409)
        self.assertEqual(
            draft_response.data['code'],
            'CLASS_RECORD_NOT_COMPLETED',
        )

        draft.status = 'completed'
        draft.save(update_fields=['status', 'updated_at'])
        unsupported_photo = self.client.post(
            '/api/feedback/',
            {
                'class_record': draft.id,
                'feeling': 'moderate',
                'photos': ['data:image/png;base64,not-supported'],
            },
            format='json',
        )
        self.assertEqual(unsupported_photo.status_code, 400)

        created = self.client.post(
            '/api/feedback/',
            {
                'class_record': draft.id,
                'feeling': 'moderate',
                'improvement_note': 'More stable',
                'comment': 'Good pace',
            },
            format='json',
        )
        self.assertEqual(created.status_code, 201)
        feedback_id = created.data['data']['id']
        self.assertEqual(created.data['data']['student']['id'], self.student.id)
        self.assertEqual(created.data['data']['photos'], [])
        self.assertFalse(created.data['data']['is_editable'])
        feedback = StudentFeedback.objects.get(pk=feedback_id)
        feedback.photos = ['https://example.invalid/legacy.jpg']
        feedback.save(update_fields=['photos', 'updated_at'])
        self.assertEqual(
            self.client.get(f'/api/feedback/{feedback_id}/').data['data']['photos'],
            [],
        )

        duplicate = self.client.post(
            '/api/feedback/',
            {'class_record': draft.id, 'feeling': 'easy'},
            format='json',
        )
        self.assertEqual(duplicate.status_code, 409)
        self.assertEqual(duplicate.data['code'], 'FEEDBACK_ALREADY_EXISTS')
        self.assertEqual(
            self.client.patch(
                f'/api/feedback/{feedback_id}/',
                {'comment': 'Changed'},
                format='json',
            ).status_code,
            405,
        )

        self.client.force_authenticate(self.other_student)
        hidden = self.client.post(
            '/api/feedback/',
            {'class_record': draft.id, 'feeling': 'hard'},
            format='json',
        )
        self.assertEqual(hidden.status_code, 404)

        for user in (
            self.student,
            self.trainer,
            self.manager,
            self.admin,
            self.super_admin,
        ):
            self.client.force_authenticate(user)
            self.assertEqual(
                self.client.get(
                    '/api/feedback/',
                    {'class_record_id': draft.id},
                ).data['data']['total'],
                1,
            )
        for user in (self.other_trainer, self.other_admin):
            self.client.force_authenticate(user)
            self.assertEqual(
                self.client.get('/api/feedback/').data['data']['total'],
                0,
            )

    def test_report_aggregation_route_and_role_visibility(self):
        plan = TrainingPlan.objects.create(
            company=self.company,
            student=self.profile,
            trainer=self.trainer,
            title='Report plan',
            start_date=self.start,
            end_date=self.today,
            target_frequency_per_week=2,
            goal_description='Core',
            focus_tags=['core'],
            status='active',
        )
        BodyAssessment.objects.create(
            student=self.profile,
            assess_date=self.start - timedelta(days=1),
            weight=60,
            flexibility_score=5,
            core_strength_score=4,
            photos=[],
            notes='Before',
        )
        BodyAssessment.objects.create(
            student=self.profile,
            assess_date=self.today - timedelta(days=1),
            weight=58,
            flexibility_score=7,
            core_strength_score=8,
            photos=[],
            notes='After',
        )
        feelings = [
            'easy', 'easy', 'easy',
            'moderate', 'moderate', 'moderate',
            'hard', 'hard',
        ]
        for index, feeling in enumerate(feelings):
            record = self._record(index)
            record.plan = plan
            record.session_number = index + 1
            record.save(update_fields=['plan', 'session_number', 'updated_at'])
            StudentFeedback.objects.create(
                company=self.company,
                class_record=record,
                student=self.student,
                feeling=feeling,
                photos=[],
            )

        params = {
            'student_id': self.student.id,
            'start': self.start.isoformat(),
            'end': self.today.isoformat(),
        }
        for user in (
            self.student,
            self.trainer,
            self.manager,
            self.admin,
            self.super_admin,
        ):
            self.client.force_authenticate(user)
            response = self.client.get('/api/reports/', params)
            self.assertEqual(response.status_code, 200, response.data)
            self.assertEqual(response['Cache-Control'], 'private, no-store')

        report = response.data['data']
        self.assertEqual(report['train_count'], 8)
        self.assertEqual(report['total_sessions'], 8)
        self.assertEqual(report['attendance_rate'], 0.875)
        self.assertEqual(len(report['rating_trend']), 8)
        self.assertEqual(report['body_comparison']['before']['weight_kg'], 60)
        self.assertEqual(report['body_comparison']['after']['weight_kg'], 58)
        self.assertEqual(
            report['feedback_summary']['distribution'],
            {'easy': 3, 'moderate': 3, 'hard': 2},
        )
        self.assertEqual(report['training_plan']['id'], plan.id)

        for user in (
            self.other_student,
            self.other_trainer,
            self.other_admin,
        ):
            self.client.force_authenticate(user)
            self.assertEqual(
                self.client.get('/api/reports/', params).status_code,
                404,
            )

    def test_report_empty_data_and_range_validation(self):
        params = {
            'student_id': self.other_student.id,
            'start': self.start.isoformat(),
            'end': self.today.isoformat(),
        }
        self.client.force_authenticate(self.other_student)
        response = self.client.get('/api/reports/', params)
        self.assertEqual(response.status_code, 200)
        report = response.data['data']
        self.assertEqual(report['total_sessions'], 0)
        self.assertIsNone(report['attendance_rate'])
        self.assertIsNone(report['average_rating'])
        self.assertEqual(report['feedback_summary']['total'], 0)
        self.assertIn('NO_ATTENDANCE_DATA', report['data_notes'])

        invalid = self.client.get(
            '/api/reports/',
            {
                **params,
                'end': (self.today + timedelta(days=1)).isoformat(),
            },
        )
        self.assertEqual(invalid.status_code, 400)

        valid_366_days = self.client.get(
            '/api/reports/',
            {
                **params,
                'start': (self.today - timedelta(days=365)).isoformat(),
            },
        )
        self.assertEqual(valid_366_days.status_code, 200)
        invalid_367_days = self.client.get(
            '/api/reports/',
            {
                **params,
                'start': (self.today - timedelta(days=366)).isoformat(),
            },
        )
        self.assertEqual(invalid_367_days.status_code, 400)
