from django.contrib import admin

from .models import ClassMedia, ClassRecord, ClassTemplate


@admin.register(ClassRecord)
class ClassRecordAdmin(admin.ModelAdmin):
    list_display = [
        'student',
        'trainer',
        'store',
        'class_date',
        'theme',
        'session_number',
        'completion_rating',
        'status',
    ]
    list_filter = ['status', 'class_date', 'store']
    search_fields = ['student__name', 'trainer__name', 'theme']
    list_select_related = ['student', 'trainer', 'store']


@admin.register(ClassMedia)
class ClassMediaAdmin(admin.ModelAdmin):
    list_display = [
        'class_record',
        'media_type',
        'caption',
        'sort_order',
    ]
    list_filter = ['media_type']
    search_fields = ['class_record__theme', 'caption']
    list_select_related = ['class_record']


@admin.register(ClassTemplate)
class ClassTemplateAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'trainer',
        'scope',
        'course_template',
        'is_active',
    ]
    list_filter = ['scope', 'is_active']
    search_fields = ['name', 'trainer__name']
    list_select_related = ['trainer', 'course_template']
