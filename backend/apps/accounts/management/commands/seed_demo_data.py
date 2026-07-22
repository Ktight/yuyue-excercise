"""Create deterministic Phase 1-5 local integration accounts and tenant data."""

from datetime import date, datetime, time, timedelta

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.accounts.models import User
from apps.attendance.models import Attendance
from apps.companies.models import Company, Room, Store
from apps.courses.models import CourseBooking, CourseSchedule, CourseTemplate
from apps.members.models import StudentProfile
from core.constants import (
    AttendanceStatus,
    CourseCategory,
    CourseDifficulty,
    MemberCardType,
    UserRole,
)


class Command(BaseCommand):
    help = 'Create deterministic local demo tenants and accounts.'

    password = 'DemoPass123!'

    @transaction.atomic
    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise CommandError(
                'seed_demo_data is restricted to DEBUG environments.'
            )
        today = date.today()
        company, _ = Company.objects.update_or_create(
            name='瑜悦演示公司',
            defaults={
                'contact_person': '演示管理员',
                'contact_phone': '13810000000',
                'contract_start': today,
                'contract_end': today + timedelta(days=365),
                'status': 'active',
            },
        )
        store, _ = Store.objects.update_or_create(
            company=company,
            name='瑜悦演示门店',
            defaults={
                'address': '上海市示例路 1 号',
                'phone': '021-60000000',
                'business_hours': '07:00-22:00',
                'status': 'active',
            },
        )
        company_two, _ = Company.objects.update_or_create(
            name='Demo Company B',
            defaults={
                'contact_person': 'Demo Admin B',
                'contact_phone': '13820000000',
                'contract_start': today,
                'contract_end': today + timedelta(days=365),
                'status': 'active',
            },
        )
        store_two, _ = Store.objects.update_or_create(
            company=company_two,
            name='Demo Store B',
            defaults={
                'address': 'Shanghai Demo Road 2',
                'phone': '021-60000002',
                'business_hours': '07:00-22:00',
                'status': 'active',
            },
        )

        super_admin = self.upsert_user(
            '13910000000', '演示超管', UserRole.SUPER_ADMIN,
            is_staff=True, is_superuser=True,
        )
        company_admin = self.upsert_user(
            '13910000001', '演示公司管理员', UserRole.COMPANY_ADMIN,
            company=company,
        )
        store_manager = self.upsert_user(
            '13910000002', '演示店长', UserRole.STORE_MANAGER,
            company=company, store=store,
        )
        trainer = self.upsert_user(
            '13910000003', '演示教练', UserRole.TRAINER,
            company=company, store=store,
        )
        student = self.upsert_user(
            '13910000004', '演示学员', UserRole.STUDENT,
            company=company, store=store,
        )
        StudentProfile.objects.update_or_create(
            user=student,
            defaults={
                'company': company,
                'home_store': store,
                'primary_trainer': trainer,
                'gender': 'female',
                'birth_date': date(2000, 1, 1),
                'emergency_contact': '演示家属 13810000001',
                'member_card_type': MemberCardType.MONTH,
                'member_card_start': today,
                'member_card_expire': today + timedelta(days=30),
                'member_card_balance': 0,
                'health_notes': '无',
                'injury_history': '无',
                'contraindications': '无',
                'training_goal': '改善体态',
                'preferred_style': '私教',
            },
        )
        trainer_two = self.upsert_user(
            '13910000005', 'Demo Trainer B', UserRole.TRAINER,
            company=company_two, store=store_two,
        )
        student_two = self.upsert_user(
            '13910000006', 'Demo Student B', UserRole.STUDENT,
            company=company_two, store=store_two,
        )
        StudentProfile.objects.update_or_create(
            user=student_two,
            defaults={
                'company': company_two,
                'home_store': store_two,
                'primary_trainer': trainer_two,
                'gender': 'male',
                'birth_date': date(1998, 1, 1),
                'emergency_contact': 'Demo Family B 13820000001',
                'member_card_type': MemberCardType.COUNT,
                'member_card_start': today,
                'member_card_expire': today + timedelta(days=30),
                'member_card_balance': 10,
                'health_notes': '',
                'injury_history': '',
                'contraindications': '',
                'training_goal': 'Mobility',
                'preferred_style': 'Private',
            },
        )

        expired_student = self.upsert_user(
            '13910000007', 'Demo Expired Student', UserRole.STUDENT,
            company=company, store=store,
        )
        exhausted_student = self.upsert_user(
            '13910000008', 'Demo Exhausted Student', UserRole.STUDENT,
            company=company, store=store,
        )
        self.upsert_profile(
            expired_student,
            company,
            store,
            trainer,
            MemberCardType.MONTH,
            today - timedelta(days=60),
            today - timedelta(days=1),
            0,
        )
        self.upsert_profile(
            exhausted_student,
            company,
            store,
            trainer,
            MemberCardType.COUNT,
            today - timedelta(days=30),
            today + timedelta(days=30),
            0,
        )
        self.seed_phase_6_7_states(
            today=today,
            company=company,
            store=store,
            trainer=trainer,
            student=student,
        )

        self.stdout.write(self.style.SUCCESS(
            f'Demo data ready. Password for all accounts: {self.password}'
        ))
        for user in [
            super_admin, company_admin, store_manager, trainer, student,
            trainer_two, student_two,
        ]:
            self.stdout.write(f'{user.role}: {user.phone}')

    def upsert_user(self, phone, name, role, **defaults):
        user, _ = User.objects.update_or_create(
            phone=phone,
            defaults={
                'name': name,
                'role': role,
                'is_active': True,
                'is_staff': defaults.pop('is_staff', False),
                'is_superuser': defaults.pop('is_superuser', False),
                **defaults,
            },
        )
        user.set_password(self.password)
        user.save(update_fields=['password'])
        return user

    @staticmethod
    def upsert_profile(
        user,
        company,
        store,
        trainer,
        card_type,
        starts_on,
        expires_on,
        balance,
    ):
        StudentProfile.objects.update_or_create(
            user=user,
            defaults={
                'company': company,
                'home_store': store,
                'primary_trainer': trainer,
                'gender': 'female',
                'birth_date': date(2000, 1, 1),
                'emergency_contact': 'Demo Family 13810000009',
                'member_card_type': card_type,
                'member_card_start': starts_on,
                'member_card_expire': expires_on,
                'member_card_balance': balance,
                'member_card_active': True,
                'health_notes': '',
                'injury_history': '',
                'contraindications': '',
                'training_goal': 'Stable integration test data',
                'preferred_style': 'Group',
            },
        )

    def seed_phase_6_7_states(self, today, company, store, trainer, student):
        room, _ = Room.objects.update_or_create(
            store=store,
            name='Demo Integration Room',
            defaults={
                'capacity': 12,
                'facilities': {'mats': 12},
                'status': 'active',
            },
        )
        course, _ = CourseTemplate.objects.update_or_create(
            company=company,
            name='Demo Integration Group Course',
            defaults={
                'category': CourseCategory.GROUP,
                'duration_minutes': 60,
                'max_capacity': 8,
                'difficulty': CourseDifficulty.BEGINNER,
                'description': 'Stable Phase 6-7 integration course.',
                'status': 'active',
            },
        )

        available = self.upsert_schedule(
            company, store, room, course, trainer,
            today + timedelta(days=2), time(10), 'published',
            booking_deadline=timezone.now() + timedelta(days=1),
        )
        available.capacity = 8
        available.save(update_fields=['capacity', 'updated_at'])
        booked_schedule = self.upsert_schedule(
            company, store, room, course, trainer,
            today + timedelta(days=3), time(10), 'published',
        )
        cancelled_booking_schedule = self.upsert_schedule(
            company, store, room, course, trainer,
            today + timedelta(days=4), time(10), 'published',
        )
        self.upsert_schedule(
            company, store, room, course, trainer,
            today + timedelta(days=5), time(10), 'cancelled',
        )
        self.upsert_schedule(
            company, store, room, course, trainer,
            today - timedelta(days=1), time(10), 'completed',
        )

        self.upsert_booking(booked_schedule, student, 'booked')
        self.upsert_booking(cancelled_booking_schedule, student, 'cancelled')

        attendance_states = (
            (AttendanceStatus.ABSENT, 4),
            (AttendanceStatus.PRESENT, 3),
            (AttendanceStatus.LATE, 2),
            (AttendanceStatus.LEAVE, 1),
        )
        for status, days_ago in attendance_states:
            schedule = self.upsert_schedule(
                company, store, room, course, trainer,
                today - timedelta(days=days_ago), time(14), 'completed',
            )
            booking = self.upsert_booking(schedule, student, 'booked')
            check_in_time = None
            if status in {AttendanceStatus.PRESENT, AttendanceStatus.LATE}:
                minutes = 0 if status == AttendanceStatus.PRESENT else 10
                check_in_time = timezone.make_aware(
                    datetime.combine(schedule.course_date, schedule.start_time)
                    + timedelta(minutes=minutes)
                )
            Attendance.objects.update_or_create(
                booking=booking,
                defaults={
                    'company': company,
                    'schedule': schedule,
                    'student': student,
                    'check_in_time': check_in_time,
                    'status': status,
                    'checked_by': trainer,
                },
            )

    @staticmethod
    def upsert_schedule(
        company,
        store,
        room,
        course,
        trainer,
        course_date,
        start_time,
        status,
        booking_deadline=None,
    ):
        end_hour = start_time.hour + 1
        schedule, _ = CourseSchedule.objects.update_or_create(
            room=room,
            course_date=course_date,
            start_time=start_time,
            defaults={
                'company': company,
                'store': store,
                'course_template': course,
                'trainer': trainer,
                'end_time': time(end_hour),
                'capacity': 8,
                'booking_deadline': booking_deadline,
                'schedule_mode': 'single',
                'recurring_rule': None,
                'status': status,
            },
        )
        return schedule

    @staticmethod
    def upsert_booking(schedule, student, status):
        booking, _ = CourseBooking.objects.update_or_create(
            schedule=schedule,
            student=student,
            defaults={
                'company': schedule.company,
                'status': status,
            },
        )
        return booking
