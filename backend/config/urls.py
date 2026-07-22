"""Root URL configuration."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/users/', include('apps.accounts.user_urls')),
    path('api/', include('apps.companies.urls')),
    path('api/', include('apps.courses.urls')),
    path('api/', include('apps.members.urls')),
    path('api/', include('apps.attendance.urls')),
    path('api/', include('apps.training.urls')),
    path('api/', include('config.api_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
