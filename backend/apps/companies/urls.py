from rest_framework.routers import DefaultRouter

from .views import CompanyViewSet, RoomViewSet, StoreViewSet


router = DefaultRouter()
router.register('companies', CompanyViewSet, basename='company')
router.register('stores', StoreViewSet, basename='store')
router.register('rooms', RoomViewSet, basename='room')

urlpatterns = router.urls
