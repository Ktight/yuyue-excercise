from rest_framework import viewsets

from core.constants import UserRole
from core.permissions import IsCompanyAdmin, IsStoreManager, IsSuperAdmin

from .models import Company, Room, Store
from .serializers import CompanySerializer, RoomSerializer, StoreSerializer


class CompanyViewSet(viewsets.ModelViewSet):
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


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.select_related('company').prefetch_related('rooms')
    serializer_class = StoreSerializer
    permission_classes = [IsCompanyAdmin]

    def get_queryset(self):
        return super().get_queryset().filter(
            company_id=self.request.user.company_id,
        )

    def perform_create(self, serializer):
        serializer.save(company_id=self.request.user.company_id)


class RoomViewSet(viewsets.ModelViewSet):
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
