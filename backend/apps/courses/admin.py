from django.contrib import admin

from .models import CourseSchedule, CourseTemplate


@admin.register(CourseTemplate)
class CourseTemplateAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'category',
        'duration_minutes',
        'max_capacity',
        'status',
    ]


@admin.register(CourseSchedule)
class CourseScheduleAdmin(admin.ModelAdmin):
    list_display = [
        'course_template',
        'course_date',
        'start_time',
        'end_time',
        'store',
        'room',
        'trainer',
        'capacity',
        'status',
    ]
