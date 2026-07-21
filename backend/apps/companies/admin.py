from django.contrib import admin

from .models import Company, Room, Store


class StoreInline(admin.TabularInline):
    model = Store
    extra = 0


class RoomInline(admin.TabularInline):
    model = Room
    extra = 0


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'contact_person', 'status', 'created_at']
    inlines = [StoreInline]


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'company',
        'name',
        'phone',
        'business_hours',
        'status',
        'created_at',
    ]
    inlines = [RoomInline]


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['id', 'store', 'name', 'capacity', 'status']
