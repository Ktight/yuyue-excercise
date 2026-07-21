"""Phase 2 authentication and tenant-aware user management API views."""

from django.db import transaction
from django.db.models import Q
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from core.constants import UserRole
from core.exceptions import ResourceNotFound
from core.permissions import IsCompanyAdmin
from core.responses import success_response

from .models import User
from .serializers import (
    ContractTokenRefreshSerializer,
    LoginSerializer,
    PasswordChangeSerializer,
    UserCreateSerializer,
    UserProfileSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return success_response(
            data={
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'token_type': 'Bearer',
                'expires_in': 1800,
                'refresh_expires_in': 604800,
                'user': UserSerializer(user).data,
            }
        )


class RefreshView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContractTokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return success_response(data=serializer.validated_data)


class CurrentUserView(APIView):
    def get(self, request):
        return success_response(data=UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(data=UserSerializer(request.user).data)


class PasswordChangeView(APIView):
    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        return success_response(data=None, message='密码修改成功')


class TenantUserQuerysetMixin:
    """Apply role, tenant, search, filter and ordering constraints."""

    ordering_fields = {'name', '-name', 'id', '-id'}

    def get_queryset(self):
        queryset = User.objects.all()
        if self.request.user.role != UserRole.SUPER_ADMIN:
            queryset = queryset.filter(company_id=self.request.user.company_id)

        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(phone__icontains=search))

        role = self.request.query_params.get('role')
        if role:
            valid_roles = {value for value, _ in UserRole.CHOICES}
            if role not in valid_roles:
                raise ValidationError({'role': ['无效的用户角色。']})
            queryset = queryset.filter(role=role)

        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            normalized = is_active.lower()
            if normalized not in {'true', 'false', '1', '0'}:
                raise ValidationError({'is_active': ['必须为布尔值。']})
            queryset = queryset.filter(is_active=normalized in {'true', '1'})

        store_id = self.request.query_params.get('store_id')
        if store_id is not None:
            try:
                store_id = int(store_id)
            except ValueError:
                raise ValidationError({'store_id': ['必须为整数。']}) from None
            if store_id < 1:
                raise ValidationError({'store_id': ['必须大于或等于 1。']})
            queryset = queryset.filter(store_id=store_id)

        ordering = self.request.query_params.get('ordering', 'id')
        if ordering not in self.ordering_fields:
            raise ValidationError({'ordering': ['不支持的排序字段。']})
        return queryset.order_by(ordering)


class UserListCreateView(TenantUserQuerysetMixin, ListCreateAPIView):
    permission_classes = [IsCompanyAdmin]

    def get_serializer_class(self):
        return UserCreateSerializer if self.request.method == 'POST' else UserSerializer

    def perform_create(self, serializer):
        company_id = self.request.user.company_id
        role = serializer.validated_data['role']
        if self.request.user.role == UserRole.SUPER_ADMIN and role == UserRole.SUPER_ADMIN:
            company_id = None
        elif company_id is None:
            raise ValidationError(
                {'company_id': ['当前操作者没有可用于创建该角色的公司。']}
            )
        self.created_user = serializer.save(company_id=company_id)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return success_response(
            data=UserSerializer(self.created_user).data,
            status=status.HTTP_201_CREATED,
        )


class UserDetailView(TenantUserQuerysetMixin, RetrieveUpdateAPIView):
    permission_classes = [IsCompanyAdmin]
    lookup_url_kwarg = 'user_id'

    def get_object(self):
        try:
            return self.get_queryset().get(pk=self.kwargs['user_id'])
        except User.DoesNotExist:
            raise ResourceNotFound(
                code='USER_NOT_FOUND',
                message='用户不存在',
            ) from None

    def retrieve(self, request, *args, **kwargs):
        return success_response(data=UserSerializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        user = self.get_object()
        serializer = UserUpdateSerializer(
            user,
            data=request.data,
            partial=partial,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            serializer.save()
        return success_response(data=UserSerializer(user).data)
