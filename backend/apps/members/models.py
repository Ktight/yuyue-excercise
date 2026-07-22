from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.accounts.models import User
from apps.companies.models import Store
from core.constants import Gender, MemberCardType
from core.mixins import TenantModelMixin


class StudentProfile(TenantModelMixin):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile',
    )
    home_store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name='students',
    )
    primary_trainer = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL,
        related_name='assigned_students',
    )
    gender = models.CharField(max_length=10, choices=Gender.CHOICES)
    birth_date = models.DateField(null=True)
    emergency_contact = models.CharField(max_length=100)
    member_card_type = models.CharField(
        max_length=10,
        choices=MemberCardType.CHOICES,
    )
    member_card_start = models.DateField()
    member_card_expire = models.DateField(db_index=True)
    member_card_balance = models.IntegerField(default=0)
    member_card_active = models.BooleanField(default=True)
    health_notes = models.TextField()
    injury_history = models.TextField()
    contraindications = models.TextField()
    training_goal = models.CharField(max_length=255)
    preferred_style = models.CharField(max_length=255)

    class Meta:
        db_table = 'student_profiles'

    def __str__(self):
        return f'{self.user.name} - {self.home_store.name}'


class BodyAssessment(models.Model):
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='assessments',
    )
    assess_date = models.DateField()
    height = models.FloatField(null=True)
    weight = models.FloatField(null=True)
    posture_spine = models.CharField(max_length=100, blank=True)
    posture_pelvis = models.CharField(max_length=100, blank=True)
    posture_shoulder = models.CharField(max_length=100, blank=True)
    flexibility_score = models.IntegerField(
        null=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    core_strength_score = models.IntegerField(
        null=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    photos = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'body_assessments'
        ordering = ['-assess_date']
