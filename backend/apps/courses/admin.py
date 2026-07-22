from django.contrib import admin

from .models import CourseTemplate


@admin.register(CourseTemplate)
class CourseTemplateAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'category',
        'duration_minutes',
        'max_capacity',
        'status',
    ]
