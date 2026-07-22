from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    BatchClassRecordView,
    ClassMediaViewSet,
    ClassRecordViewSet,
    ClassTemplateViewSet,
    FileUploadView,
)


app_name = 'training'

router = DefaultRouter()
router.register('class-records', ClassRecordViewSet, basename='class-record')
router.register('class-templates', ClassTemplateViewSet, basename='class-template')

class_media_list = ClassMediaViewSet.as_view({'get': 'list', 'post': 'create'})
class_media_detail = ClassMediaViewSet.as_view(
    {
        'get': 'retrieve',
        'patch': 'partial_update',
        'delete': 'destroy',
    }
)

urlpatterns = router.urls + [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path(
        'training/batch-records/',
        BatchClassRecordView.as_view(),
        name='batch-class-records',
    ),
    path(
        'class-records/<int:record_id>/media/',
        class_media_list,
        name='class-record-media-list',
    ),
    path(
        'class-records/<int:record_id>/media/<int:pk>/',
        class_media_detail,
        name='class-record-media-detail',
    ),
]
