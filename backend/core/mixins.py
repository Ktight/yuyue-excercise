"""Reusable model mixins and managers."""

from django.db import models
from rest_framework import status

from apps.companies.models import Company
from core.responses import success_payload, success_response


class TenantManager(models.Manager):
    """Base manager for tenant-aware querysets."""

    def get_queryset(self):
        queryset = super().get_queryset()
        # Phase 3: filter this queryset by the active request company.
        return queryset


class TenantModelMixin(models.Model):
    """Shared fields for models that belong to a company tenant."""

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = TenantManager()

    class Meta:
        abstract = True


class ContractResponseMixin:
    """Wrap ModelViewSet success responses in the public contract envelope."""

    @staticmethod
    def _wrap(response):
        response.data = success_payload(data=response.data)
        return response

    def create(self, request, *args, **kwargs):
        return self._wrap(super().create(request, *args, **kwargs))

    def retrieve(self, request, *args, **kwargs):
        return self._wrap(super().retrieve(request, *args, **kwargs))

    def update(self, request, *args, **kwargs):
        return self._wrap(super().update(request, *args, **kwargs))

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return success_response(data=None, status=status.HTTP_200_OK)
