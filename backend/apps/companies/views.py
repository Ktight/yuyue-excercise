from rest_framework import serializers, viewsets
from rest_framework.exceptions import PermissionDenied

from core.constants import UserRole
from core.mixins import ContractResponseMixin
from core.permissions import IsCompanyAdmin, IsStoreManager, IsSuperAdmin

from .models import Company, Room, Store
from .serializers import CompanySerializer, RoomSerializer, StoreSerializer


class CompanyViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_permissions(self):
        permission_classes = (
            [IsSuperAdmin]
            if self.action in {'create', 'destroy'}
            else [IsCompanyAdmin]
        )
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == UserRole.SUPER_ADMIN:
            return queryset
        return queryset.filter(pk=self.request.user.company_id)


class StoreViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    queryset = Store.objects.select_related('company').prefetch_related('rooms')
    serializer_class = StoreSerializer
    permission_classes = [IsCompanyAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == UserRole.SUPER_ADMIN:
            return queryset
        return queryset.filter(company_id=self.request.user.company_id)

    def perform_create(self, serializer):
        if self.request.user.company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前操作者未关联公司。']}
            )
        serializer.save(company_id=self.request.user.company_id)


class RoomViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    queryset = Room.objects.select_related('store', 'store__company')
    serializer_class = RoomSerializer
    permission_classes = [IsStoreManager]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if user.role == UserRole.SUPER_ADMIN:
            return queryset
        if user.role == UserRole.COMPANY_ADMIN:
            return queryset.filter(store__company_id=user.company_id)
        return queryset.filter(store_id=user.store_id)

    def _validate_store_scope(self, store):
        user = self.request.user
        if user.role == UserRole.SUPER_ADMIN:
            return
        if user.role == UserRole.COMPANY_ADMIN:
            if store.company_id == user.company_id:
                return
        elif store.id == user.store_id and store.company_id == user.company_id:
            return
        raise PermissionDenied('不能修改其他租户的场地。')

    def perform_create(self, serializer):
        store = serializer.validated_data['store']
        self._validate_store_scope(store)
        serializer.save()

    def perform_update(self, serializer):
        store = serializer.validated_data.get(
            'store',
            serializer.instance.store,
        )
        self._validate_store_scope(store)
        serializer.save()
