from django.db.models import Q
from rest_framework import serializers, viewsets
from rest_framework.exceptions import PermissionDenied

from core.constants import CourseCategory, CourseDifficulty, ResourceStatus, UserRole
from core.mixins import ContractResponseMixin
from core.permissions import IsCompanyAdmin, IsTrainer

from .models import CourseTemplate
from .serializers import CourseTemplateSerializer


class CourseTemplateViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
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
        user = self.request.user
        requested_company = self.request.query_params.get('company_id')
        if user.role == UserRole.SUPER_ADMIN:
            if requested_company:
                queryset = queryset.filter(company_id=requested_company)
        else:
            if requested_company and str(requested_company) != str(user.company_id):
                raise PermissionDenied('不能筛选其他公司的课程模板。')
            queryset = queryset.filter(company_id=user.company_id)

        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        filters = {
            'category': {value for value, _ in CourseCategory.CHOICES},
            'difficulty': {value for value, _ in CourseDifficulty.CHOICES},
            'status': {value for value, _ in ResourceStatus.CHOICES},
        }
        for field, allowed in filters.items():
            value = self.request.query_params.get(field)
            if value:
                if value not in allowed:
                    raise serializers.ValidationError(
                        {field: ['无效的筛选值。']}
                    )
                queryset = queryset.filter(**{field: value})
        ordering = self.request.query_params.get('ordering')
        allowed_ordering = {
            'category', '-category', 'name', '-name',
            'created_at', '-created_at', 'updated_at', '-updated_at',
        }
        if ordering:
            if ordering not in allowed_ordering:
                raise serializers.ValidationError(
                    {'ordering': ['不支持的排序字段。']}
                )
            queryset = queryset.order_by(ordering)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前操作者未关联公司。']}
            )
        serializer.save(company_id=self.request.user.company_id)

    def perform_update(self, serializer):
        if serializer.instance.company.status != ResourceStatus.ACTIVE:
            raise serializers.ValidationError(
                {'company': ['公司已停用，不能修改课程模板。']}
            )
        serializer.save()
