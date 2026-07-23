from django.db import models

from core.constants import FeedbackFeeling
from core.mixins import TenantModelMixin


class StudentFeedback(TenantModelMixin):
    FEELING_CHOICES = FeedbackFeeling.CHOICES

    class_record = models.OneToOneField(
        'training.ClassRecord',
        on_delete=models.CASCADE,
        related_name='feedback',
    )
    student = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='given_feedbacks',
    )
    feeling = models.CharField(max_length=10, choices=FEELING_CHOICES)
    improvement_note = models.TextField(blank=True)
    comment = models.TextField(blank=True)
    photos = models.JSONField(default=list)

    class Meta:
        db_table = 'student_feedbacks'

    def __str__(self):
        return f'{self.student.name} - {self.class_record}'
