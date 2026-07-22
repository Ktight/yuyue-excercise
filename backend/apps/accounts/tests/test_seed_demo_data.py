from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase, override_settings

from apps.accounts.models import User
from apps.attendance.models import Attendance
from apps.companies.models import Company, Room, Store
from apps.courses.models import CourseBooking, CourseSchedule
from apps.members.models import StudentProfile
from apps.members.services import get_membership_status
from core.constants import AttendanceStatus, MembershipStatus, UserRole


class DemoDataCommandTests(TestCase):
    @override_settings(DEBUG=False)
    def test_command_is_blocked_outside_debug_environments(self):
        with self.assertRaises(CommandError):
            call_command('seed_demo_data', verbosity=0)

    @override_settings(DEBUG=True)
    def test_command_creates_repeatable_phase_1_7_integration_data(self):
        call_command('seed_demo_data', verbosity=0)
        call_command('seed_demo_data', verbosity=0)

        self.assertGreaterEqual(Company.objects.count(), 2)
        self.assertGreaterEqual(Store.objects.count(), 2)
        self.assertEqual(
            set(User.objects.values_list('role', flat=True)),
            {
                UserRole.SUPER_ADMIN,
                UserRole.COMPANY_ADMIN,
                UserRole.STORE_MANAGER,
                UserRole.TRAINER,
                UserRole.STUDENT,
            },
        )
        profiles = StudentProfile.objects.select_related('user').all()
        membership_statuses = {
            get_membership_status(profile)[0] for profile in profiles
        }
        self.assertTrue(
            {
                MembershipStatus.ACTIVE,
                MembershipStatus.EXPIRED,
                MembershipStatus.EXHAUSTED,
            }.issubset(membership_statuses)
        )

        room = Room.objects.get(name='Demo Integration Room')
        schedules = CourseSchedule.objects.filter(room=room)
        self.assertEqual(schedules.count(), 9)
        self.assertTrue(
            {'published', 'cancelled', 'completed'}.issubset(
                set(schedules.values_list('status', flat=True))
            )
        )
        self.assertTrue(
            {'booked', 'cancelled'}.issubset(
                set(
                    CourseBooking.objects.filter(schedule__room=room)
                    .values_list('status', flat=True)
                )
            )
        )
        self.assertEqual(
            set(
                Attendance.objects.filter(schedule__room=room)
                .values_list('status', flat=True)
            ),
            {
                AttendanceStatus.ABSENT,
                AttendanceStatus.PRESENT,
                AttendanceStatus.LATE,
                AttendanceStatus.LEAVE,
            },
        )
