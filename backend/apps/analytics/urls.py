from django.urls import path

from .views import (
    AdminDashboardView,
    ReminderDismissView,
    ReminderListView,
    ReminderReadView,
)


app_name = 'analytics'

urlpatterns = [
    path(
        'dashboards/admin/',
        AdminDashboardView.as_view(),
        name='admin-dashboard',
    ),
    path('reminders/', ReminderListView.as_view(), name='reminder-list'),
    path(
        'reminders/<int:reminder_id>/read/',
        ReminderReadView.as_view(),
        name='reminder-read',
    ),
    path(
        'reminders/<int:reminder_id>/dismiss/',
        ReminderDismissView.as_view(),
        name='reminder-dismiss',
    ),
]
