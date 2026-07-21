from django.db import models

from core.constants import CourseCategory, ResourceStatus
from core.mixins import TenantModelMixin


class CourseTemplate(TenantModelMixin):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CourseCategory.CHOICES)
    duration_minutes = models.PositiveIntegerField(default=60)
    max_capacity = models.PositiveIntegerField(default=1)
    difficulty = models.CharField(
        max_length=20,
        choices=(
            ('beginner', '初级'),
            ('intermediate', '中级'),
            ('advanced', '高级'),
        ),
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

    def __str__(self):
        return self.name
