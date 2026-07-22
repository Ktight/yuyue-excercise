from rest_framework.routers import DefaultRouter

from .views import CourseTemplateViewSet


router = DefaultRouter()
router.register(
    'course-templates',
    CourseTemplateViewSet,
    basename='course-template',
)

urlpatterns = router.urls
