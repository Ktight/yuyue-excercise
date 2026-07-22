from rest_framework.routers import DefaultRouter

from .views import BookingViewSet, CourseScheduleViewSet, CourseTemplateViewSet


router = DefaultRouter()
router.register(
    'course-templates',
    CourseTemplateViewSet,
    basename='course-template',
)
router.register(
    'schedules',
    CourseScheduleViewSet,
    basename='schedule',
)
router.register(
    'bookings',
    BookingViewSet,
    basename='booking',
)

urlpatterns = router.urls
