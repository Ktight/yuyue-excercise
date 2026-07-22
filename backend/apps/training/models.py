from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from core.mixins import TenantModelMixin


class TrainingPlan(TenantModelMixin):
    """Phase 9 extension point required by ClassRecord.plan."""

    STATUS_CHOICES = (
        ('draft', '草稿'),
        ('active', '进行中'),
        ('completed', '已完成'),
        ('cancelled', '已取消'),
    )

    student = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='training_plans',
    )
    trainer = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='managed_training_plans',
    )
    name = models.CharField(max_length=200)
    starts_on = models.DateField()
    ends_on = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft',
    )
    stages = models.JSONField(default=list)

    class Meta:
        db_table = 'training_plans'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class ClassRecord(TenantModelMixin):
    STATUS_CHOICES = (
        ('draft', '草稿'),
        ('completed', '完成'),
    )

    attendance = models.OneToOneField(
        'attendance.Attendance',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='class_record',
    )
    schedule = models.ForeignKey(
        'courses.CourseSchedule',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='class_records',
    )
    student = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='class_records',
    )
    trainer = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='taught_records',
    )
    store = models.ForeignKey(
        'companies.Store',
        on_delete=models.CASCADE,
        related_name='class_records',
    )
    plan = models.ForeignKey(
        'TrainingPlan',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='class_records',
    )
    class_date = models.DateField()
    theme = models.CharField(max_length=200)
    session_number = models.PositiveIntegerField(default=1)
    pose_sequence = models.JSONField(default=dict)
    trainer_notes = models.TextField(blank=True)
    homework = models.TextField(blank=True)
    completion_rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    improvement_tags = models.JSONField(default=list)
    next_focus = models.CharField(max_length=200, blank=True)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft',
    )

    class Meta:
        db_table = 'class_records'
        ordering = ['-class_date', '-created_at']

    def __str__(self):
        return f'{self.student.name} - {self.class_date} - {self.theme}'


class ClassMedia(models.Model):
    MEDIA_TYPE_CHOICES = (
        ('image', '图片'),
        ('video', '视频'),
    )

    class_record = models.ForeignKey(
        ClassRecord,
        on_delete=models.CASCADE,
        related_name='media',
    )
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    file_url = models.URLField()
    thumbnail_url = models.URLField(blank=True)
    caption = models.CharField(max_length=255, blank=True)
    annotations = models.JSONField(null=True, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'class_media'

    def __str__(self):
        return f'{self.class_record} - {self.get_media_type_display()}'


class ClassTemplate(TenantModelMixin):
    SCOPE_CHOICES = (
        ('personal', '个人'),
        ('company_shared', '公司共享'),
    )

    trainer = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='class_templates',
    )
    name = models.CharField(max_length=200)
    scope = models.CharField(max_length=20, choices=SCOPE_CHOICES)
    course_template = models.ForeignKey(
        'courses.CourseTemplate',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='class_templates',
    )
    pose_sequence = models.JSONField()
    notes_template = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'class_templates'

    def __str__(self):
        return self.name
