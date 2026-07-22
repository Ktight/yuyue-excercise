from django.db import models

from core.constants import AttendanceStatus
from core.mixins import TenantModelMixin


class Attendance(TenantModelMixin):
    booking = models.OneToOneField(
        'courses.CourseBooking',
        on_delete=models.CASCADE,
        related_name='attendance',
    )
    schedule = models.ForeignKey(
        'courses.CourseSchedule',
        on_delete=models.CASCADE,
        related_name='attendances',
    )
    student = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='attendances',
    )
    check_in_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=AttendanceStatus.CHOICES,
        default=AttendanceStatus.ABSENT,
    )
    checked_by = models.ForeignKey(
        'accounts.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='checked_attendances',
    )

    class Meta:
        db_table = 'attendances'

    def __str__(self):
        return f'{self.student.name} - {self.schedule} - {self.status}'
