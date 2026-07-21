"""Shared role-based and object-level permission classes."""

from rest_framework.permissions import BasePermission, SAFE_METHODS

from core.constants import UserRole


class IsSuperAdmin(BasePermission):
    """Allow access only to super administrators."""

    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) == UserRole.SUPER_ADMIN


class IsCompanyAdmin(BasePermission):
    """Allow access to company and super administrators."""

    allowed_roles = (UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)

    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) in self.allowed_roles


class IsStoreManager(BasePermission):
    """Allow access to store managers and higher-level administrators."""

    allowed_roles = (
        UserRole.SUPER_ADMIN,
        UserRole.COMPANY_ADMIN,
        UserRole.STORE_MANAGER,
    )

    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) in self.allowed_roles


class IsTrainer(BasePermission):
    """Allow access to trainers and higher-level administrators."""

    allowed_roles = (
        UserRole.SUPER_ADMIN,
        UserRole.COMPANY_ADMIN,
        UserRole.STORE_MANAGER,
        UserRole.TRAINER,
    )

    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) in self.allowed_roles


class IsOwnerOrRead(BasePermission):
    """Allow reads to everyone and writes to owners or administrators."""

    admin_roles = (
        UserRole.SUPER_ADMIN,
        UserRole.COMPANY_ADMIN,
        UserRole.STORE_MANAGER,
    )

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        if getattr(user, 'role', None) in self.admin_roles:
            return True

        owner = getattr(obj, 'owner', None)
        if owner is None:
            owner = getattr(obj, 'user', None)
        return owner == user
