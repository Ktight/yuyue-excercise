from django.contrib import admin

from .models import BodyAssessment, StudentProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'home_store',
        'primary_trainer',
        'member_card_type',
        'member_card_expire',
        'member_card_balance',
    ]


@admin.register(BodyAssessment)
class BodyAssessmentAdmin(admin.ModelAdmin):
    list_display = [
        'student',
        'assess_date',
        'height',
        'weight',
        'flexibility_score',
        'core_strength_score',
    ]
