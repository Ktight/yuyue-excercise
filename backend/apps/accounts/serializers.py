"""Serializers for Phase 2 authentication and user management."""

from django.contrib.auth import password_validation
from django.core.validators import RegexValidator
from rest_framework import serializers
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from core.constants import UserRole
from core.exceptions import (
    AccountDisabled,
    ConflictError,
    InvalidCredentials,
    OldPasswordIncorrect,
    RefreshTokenInvalid,
    StoreNotAllowedForRole,
    StoreRequiredForRole,
)
from apps.companies.models import Store

from .models import User


PHONE_REGEX = r'^1[3-9][0-9]{9}$'
PHONE_VALIDATOR = RegexValidator(PHONE_REGEX, '手机号格式不正确')
STORE_ROLES = {UserRole.STORE_MANAGER, UserRole.TRAINER}


class UserSerializer(serializers.ModelSerializer):
    """Canonical public representation of a user."""

    class Meta:
        model = User
        fields = [
            'id',
            'phone',
            'name',
            'role',
            'avatar',
            'company_id',
            'store_id',
            'is_active',
        ]
        read_only_fields = fields


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20, validators=[PHONE_VALIDATOR])
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        try:
            user = User.objects.get(phone=attrs['phone'])
        except User.DoesNotExist:
            raise InvalidCredentials() from None
        if not user.check_password(attrs['password']):
            raise InvalidCredentials()
        if not user.is_active:
            raise AccountDisabled()
        attrs['user'] = user
        return attrs


class ContractTokenRefreshSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            refresh = RefreshToken(attrs['refresh_token'])
            access_token = refresh.access_token
            if api_settings.ROTATE_REFRESH_TOKENS:
                if api_settings.BLACKLIST_AFTER_ROTATION:
                    refresh.blacklist()
                refresh.set_jti()
                refresh.set_exp()
                refresh.set_iat()
        except (TokenError, KeyError):
            raise RefreshTokenInvalid() from None
        return {
            'access_token': str(access_token),
            'refresh_token': str(refresh),
            'token_type': 'Bearer',
            'expires_in': 1800,
            'refresh_expires_in': 604800,
        }


class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(write_only=True)

    def validate_refresh_token(self, value):
        try:
            token = RefreshToken(value)
        except TokenError:
            raise RefreshTokenInvalid() from None
        if str(token.get('user_id')) != str(self.context['request'].user.id):
            raise RefreshTokenInvalid()
        self.token = token
        return value

    def save(self, **kwargs):
        try:
            self.token.blacklist()
        except TokenError:
            raise RefreshTokenInvalid() from None


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'avatar']

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                {'non_field_errors': ['至少提交一个可修改字段。']}
            )
        return attrs


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        min_length=8,
    )

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs['old_password']):
            raise OldPasswordIncorrect()
        password_validation.validate_password(attrs['new_password'], user=user)
        return attrs


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        min_length=8,
    )

    def validate_new_password(self, value):
        password_validation.validate_password(value, user=self.context['target_user'])
        return value


class UserCreateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(max_length=20, validators=[PHONE_VALIDATOR])
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        min_length=8,
    )
    store_id = serializers.IntegerField(required=False, allow_null=True, min_value=1)

    class Meta:
        model = User
        fields = ['phone', 'name', 'password', 'role', 'store_id', 'is_active']
        extra_kwargs = {'is_active': {'required': False}}

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise ConflictError(
                code='PHONE_ALREADY_EXISTS',
                message='手机号已存在',
                errors={'phone': ['该手机号已被使用。']},
            )
        return value

    def validate(self, attrs):
        request_user = self.context['request'].user
        role = attrs['role']
        store_id = attrs.get('store_id')

        if request_user.role == UserRole.COMPANY_ADMIN and role not in {
            UserRole.STORE_MANAGER,
            UserRole.TRAINER,
        }:
            raise serializers.ValidationError(
                {'role': ['公司管理员只能创建门店经理或教练。']}
            )
        if role == UserRole.STUDENT:
            raise serializers.ValidationError(
                {'role': ['本阶段不通过管理员接口创建学员。']}
            )
        _validate_role_store(role, store_id)
        _validate_store_tenant(request_user, store_id)
        password_validation.validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        request_user = self.context['request'].user
        company_id = request_user.company_id
        if (
            request_user.role == UserRole.SUPER_ADMIN
            and validated_data['role'] == UserRole.SUPER_ADMIN
        ):
            company_id = None
        elif company_id is None:
            raise serializers.ValidationError(
                {'company_id': ['当前操作者没有可用于创建该角色的公司。']}
            )

        password = validated_data.pop('password')
        return User.objects.create_user(
            password=password,
            company_id=company_id,
            **validated_data,
        )

    def to_representation(self, instance):
        return UserSerializer(instance).data


class UserUpdateSerializer(serializers.ModelSerializer):
    store_id = serializers.IntegerField(required=False, allow_null=True, min_value=1)

    class Meta:
        model = User
        fields = ['name', 'role', 'store_id', 'is_active']
        extra_kwargs = {
            'name': {'required': False},
            'role': {'required': False},
            'is_active': {'required': False},
        }

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                {'non_field_errors': ['至少提交一个可修改字段。']}
            )
        request_user = self.context['request'].user
        role = attrs.get('role', self.instance.role)
        store_id = attrs.get('store_id', self.instance.store_id)
        if request_user.role == UserRole.COMPANY_ADMIN and role not in STORE_ROLES:
            raise serializers.ValidationError(
                {'role': ['公司管理员只能管理门店经理或教练角色。']}
            )
        if role not in STORE_ROLES:
            if attrs.get('store_id') is not None and 'store_id' in attrs:
                raise StoreNotAllowedForRole()
            attrs['store_id'] = None
            store_id = None
        _validate_role_store(role, store_id)
        _validate_store_tenant(request_user, store_id)
        return attrs

    def to_representation(self, instance):
        return UserSerializer(instance).data


class UserListSerializer(UserCreateSerializer):
    """Create users from the tenant-aware user list endpoint."""


def _validate_role_store(role, store_id):
    if role == UserRole.STORE_MANAGER and store_id is None:
        raise StoreRequiredForRole()
    if role not in STORE_ROLES and store_id is not None:
        raise StoreNotAllowedForRole()


def _validate_store_tenant(request_user, store_id):
    if store_id is None:
        return
    if request_user.role == UserRole.SUPER_ADMIN:
        if not Store.objects.filter(pk=store_id).exists():
            raise serializers.ValidationError({'store_id': ['Store does not exist.']})
        return
    if not Store.objects.filter(
        pk=store_id,
        company_id=request_user.company_id,
    ).exists():
        raise serializers.ValidationError(
            {'store_id': ['Store does not belong to the current company.']}
        )
