from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import BodyAssessmentViewSet, StudentProfileViewSet


router = DefaultRouter()
router.register('students', StudentProfileViewSet, basename='student')
router.register(
    'body-assessments',
    BodyAssessmentViewSet,
    basename='body-assessment',
)

assessment_list = BodyAssessmentViewSet.as_view(
    {'get': 'list', 'post': 'create'}
)
assessment_detail = BodyAssessmentViewSet.as_view(
    {'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}
)

urlpatterns = router.urls + [
    path(
        'students/<int:student_pk>/assessments/',
        assessment_list,
        name='student-assessment-list',
    ),
    path(
        'students/<int:student_pk>/assessments/<int:pk>/',
        assessment_detail,
        name='student-assessment-detail',
    ),
]
