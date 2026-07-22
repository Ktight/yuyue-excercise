"""Tenant-aware user management endpoint routes."""

from django.urls import path

from .views import UserDetailView, UserListCreateView, UserResetPasswordView


app_name = 'accounts-users'

urlpatterns = [
    path('', UserListCreateView.as_view(), name='list-create'),
    path('<int:user_id>/', UserDetailView.as_view(), name='detail'),
    path(
        '<int:user_id>/reset-password/',
        UserResetPasswordView.as_view(),
        name='reset-password',
    ),
]
