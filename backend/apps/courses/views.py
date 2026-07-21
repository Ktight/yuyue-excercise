from rest_framework import viewsets

from core.constants import UserRole
from core.permissions import IsCompanyAdmin, IsTrainer

from .models import CourseTemplate
from .serializers import CourseTemplateSerializer


class CourseTemplateViewSet(viewsets.ModelViewSet):
    queryset = CourseTemplate.objects.all()
    serializer_class = CourseTemplateSerializer

    def get_permissions(self):
        permission_classes = (
            [IsTrainer]
            if self.action in {'list', 'retrieve'}
            else [IsCompanyAdmin]
        )
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == UserRole.SUPER_ADMIN:
            return queryset
        return queryset.filter(company_id=self.request.user.company_id)

    def perform_create(self, serializer):
        serializer.save(company_id=self.request.user.company_id)
