"""Authentication endpoint routes."""

from django.urls import path

from .views import CurrentUserView, LoginView, LogoutView, PasswordChangeView, RefreshView


app_name = 'accounts-auth'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', CurrentUserView.as_view(), name='me'),
    path('change-password/', PasswordChangeView.as_view(), name='change-password'),
]
