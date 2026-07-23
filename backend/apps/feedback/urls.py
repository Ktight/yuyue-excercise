from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ReportView, StudentFeedbackViewSet


app_name = 'feedback'

router = DefaultRouter()
router.register('feedback', StudentFeedbackViewSet, basename='feedback')

urlpatterns = [
    path('reports/', ReportView.as_view(), name='report-preview'),
    *router.urls,
]
