from django.core.validators import MaxValueValidator
from django.db import models
from django.db.models import Q

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
