from django.contrib import admin

from .models import StudentFeedback


@admin.register(StudentFeedback)
class StudentFeedbackAdmin(admin.ModelAdmin):
    list_display = [
        'class_record',
        'student',
        'feeling',
        'company',
        'created_at',
    ]
    list_filter = ['feeling', 'company', 'created_at']
    search_fields = [
        'student__name',
        'student__phone',
        'class_record__theme',
        'improvement_note',
        'comment',
    ]
    list_select_related = ['class_record', 'student', 'company']
    readonly_fields = ['photos', 'created_at', 'updated_at']
