"""User models for phone-based authentication."""

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from core.constants import UserRole


class UserManager(BaseUserManager):
    """Create users authenticated by their phone number."""

    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('用户必须提供手机号')

        user = self.model(phone=str(phone).strip(), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('role', UserRole.SUPER_ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('超级管理员必须设置 is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('超级管理员必须设置 is_superuser=True')
        if extra_fields.get('role') != UserRole.SUPER_ADMIN:
            raise ValueError('超级管理员角色必须为 super_admin')

        return self.create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Project user authenticated with a unique phone number."""

    phone = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    avatar = models.URLField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=UserRole.CHOICES)
    company_id = models.IntegerField(null=True, blank=True)
    store_id = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['name', 'role']

    def __str__(self):
        return f'{self.name} ({self.phone})'
