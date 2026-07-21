"""Reusable model mixins and managers."""

from django.db import models

from apps.companies.models import Company


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
