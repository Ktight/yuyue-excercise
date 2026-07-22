from django.core.validators import MaxValueValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone

from core.constants import CourseCategory, CourseDifficulty, ResourceStatus
from core.mixins import TenantModelMixin


class CourseTemplate(TenantModelMixin):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CourseCategory.CHOICES)
    duration_minutes = models.PositiveIntegerField(
        default=60,
        validators=[MaxValueValidator(1440)],
    )
    max_capacity = models.PositiveIntegerField(default=1)
    difficulty = models.CharField(
        max_length=20,
        choices=CourseDifficulty.CHOICES,
    )
    description = models.TextField(blank=True)
    cover_image = models.URLField(blank=True)
    status = models.CharField(
        max_length=8,
        choices=(
            (ResourceStatus.ACTIVE, '启用'),
            (ResourceStatus.INACTIVE, '停用'),
        ),
        default=ResourceStatus.ACTIVE,
    )

    class Meta:
        db_table = 'course_templates'
        ordering = ['category', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['company', 'name'],
                name='unique_course_template_name_per_company',
            ),
            models.CheckConstraint(
                check=~Q(category=CourseCategory.PRIVATE) | Q(max_capacity=1),
                name='private_course_capacity_is_one',
            ),
        ]

    def __str__(self):
        return self.name


class CourseSchedule(TenantModelMixin):
    SCHEDULE_MODE_CHOICES = (
        ('single', '单次'),
        ('recurring', '周期'),
    )
    STATUS_CHOICES = (
        ('published', '已发布'),
        ('cancelled', '已取消'),
        ('completed', '已完成'),
    )

    store = models.ForeignKey(
        'companies.Store',
        on_delete=models.CASCADE,
    )
    room = models.ForeignKey(
        'companies.Room',
        on_delete=models.CASCADE,
    )
    course_template = models.ForeignKey(
        CourseTemplate,
        on_delete=models.CASCADE,
    )
    trainer = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='teaching_schedules',
    )
    course_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    capacity = models.PositiveIntegerField()
    booking_deadline = models.DateTimeField(null=True, blank=True)
    schedule_mode = models.CharField(
        max_length=10,
        choices=SCHEDULE_MODE_CHOICES,
        default='single',
    )
    recurring_rule = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    class Meta:
        db_table = 'course_schedules'
        ordering = ['course_date', 'start_time']
        constraints = [
            models.UniqueConstraint(
                fields=['room', 'course_date', 'start_time'],
                name='unique_room_schedule_start',
            ),
            models.UniqueConstraint(
                fields=['trainer', 'course_date', 'start_time'],
                name='unique_trainer_schedule_start',
            ),
        ]

    def __str__(self):
        return f'{self.course_template} - {self.course_date} {self.start_time}'


class CourseBooking(TenantModelMixin):
    STATUS_CHOICES = (
        ('booked', '已预约'),
        ('cancelled', '已取消'),
    )

    schedule = models.ForeignKey(
        CourseSchedule,
        on_delete=models.CASCADE,
        related_name='bookings',
    )
    student = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='course_bookings',
    )
    booking_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    class Meta:
        db_table = 'course_bookings'
        constraints = [
            models.UniqueConstraint(
                fields=['schedule', 'student'],
                name='unique_schedule_student_booking',
            ),
        ]

    def can_book(self):
        """Return a quick capacity/deadline check; services enforce atomically."""
        deadline_is_open = (
            self.schedule.booking_deadline is None
            or timezone.now() <= self.schedule.booking_deadline
        )
        booked_count = self.schedule.bookings.filter(status='booked').count()
        return deadline_is_open and booked_count < self.schedule.capacity

    def __str__(self):
        return f'{self.student.name} - {self.schedule}'
