from django.db import models

from core.constants import ResourceStatus


class Company(models.Model):
    name = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=50)
    contact_phone = models.CharField(max_length=20)
    contract_start = models.DateField()
    contract_end = models.DateField()
    status = models.CharField(
        max_length=8,
        choices=(
            (ResourceStatus.ACTIVE, '启用'),
            (ResourceStatus.INACTIVE, '停用'),
        ),
        default=ResourceStatus.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Store(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='stores',
    )
    name = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    business_hours = models.CharField(max_length=50)
    status = models.CharField(
        max_length=8,
        choices=(
            (ResourceStatus.ACTIVE, '启用'),
            (ResourceStatus.INACTIVE, '停用'),
        ),
        default=ResourceStatus.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['company', 'name']

    def __str__(self):
        return self.name


class Room(models.Model):
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name='rooms',
    )
    name = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField(default=10)
    facilities = models.JSONField(null=True)
    status = models.CharField(
        max_length=8,
        choices=(
            (ResourceStatus.ACTIVE, '启用'),
            (ResourceStatus.INACTIVE, '停用'),
        ),
        default=ResourceStatus.ACTIVE,
    )

    def __str__(self):
        return self.name
