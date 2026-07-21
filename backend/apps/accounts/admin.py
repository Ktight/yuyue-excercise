"""Django admin configuration for accounts."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ('phone',)
    list_display = ('phone', 'name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('phone', 'name')
    readonly_fields = ('created_at', 'last_login')

    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        ('个人信息', {'fields': ('name', 'avatar', 'role')}),
        ('组织归属', {'fields': ('company_id', 'store_id')}),
        (
            '权限',
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                ),
            },
        ),
        ('重要日期', {'fields': ('last_login', 'created_at')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'phone',
                    'name',
                    'role',
                    'password1',
                    'password2',
                    'is_staff',
                    'is_active',
                ),
            },
        ),
    )
