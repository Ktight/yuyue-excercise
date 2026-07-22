"""Canonical API exceptions and the global DRF exception handler."""

from django.db import IntegrityError
from django.http import Http404
from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


class ContractAPIException(exceptions.APIException):
    """API exception carrying a stable public error code."""

    status_code = status.HTTP_400_BAD_REQUEST
    error_code = 'VALIDATION_ERROR'
    default_detail = '请求参数校验失败'

    def __init__(self, message=None, errors=None):
        self.public_message = message or self.default_detail
        self.public_errors = errors or {}
        super().__init__(detail=self.public_message, code=self.error_code)


class InvalidCredentials(ContractAPIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = 'INVALID_CREDENTIALS'
    default_detail = '手机号或密码错误'


class AccountDisabled(ContractAPIException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = 'ACCOUNT_DISABLED'
    default_detail = '账号已停用'


class RefreshTokenInvalid(ContractAPIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = 'REFRESH_TOKEN_INVALID'
    default_detail = 'Refresh Token 无效或已过期'


class OldPasswordIncorrect(ContractAPIException):
    status_code = status.HTTP_400_BAD_REQUEST
    error_code = 'OLD_PASSWORD_INCORRECT'
    default_detail = '原密码不正确'

    def __init__(self):
        super().__init__(errors={'old_password': ['原密码不正确']})


class StoreRequiredForRole(ContractAPIException):
    error_code = 'STORE_REQUIRED_FOR_ROLE'
    default_detail = '该角色必须关联门店'

    def __init__(self):
        super().__init__(errors={'store_id': ['门店经理必须关联一个门店。']})


class StoreNotAllowedForRole(ContractAPIException):
    error_code = 'STORE_NOT_ALLOWED_FOR_ROLE'
    default_detail = '该角色不允许关联门店'

    def __init__(self):
        super().__init__(errors={'store_id': ['该角色不允许关联门店。']})


class ConflictError(ContractAPIException):
    status_code = status.HTTP_409_CONFLICT
    error_code = 'CONFLICT'
    default_detail = '资源状态冲突'

    def __init__(self, message=None, errors=None, code=None):
        if code:
            self.error_code = code
        super().__init__(message=message, errors=errors)


class ResourceNotFound(ContractAPIException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = 'NOT_FOUND'
    default_detail = '资源不存在'

    def __init__(self, message=None, errors=None, code=None):
        if code:
            self.error_code = code
        super().__init__(message=message, errors=errors)


def contract_exception_handler(exc, context):
    """Convert DRF, SimpleJWT and unhandled API errors to one envelope."""
    request = context.get('request')
    request_id = getattr(request, 'request_id', '') or 'req_unknown'

    if isinstance(exc, ContractAPIException):
        return _error_response(
            exc.error_code,
            exc.public_message,
            exc.public_errors,
            request_id,
            exc.status_code,
        )

    if isinstance(exc, exceptions.ValidationError):
        return _error_response(
            'VALIDATION_ERROR',
            '请求参数校验失败',
            _normalize_errors(exc.detail),
            request_id,
            status.HTTP_400_BAD_REQUEST,
        )
    if isinstance(exc, (exceptions.NotAuthenticated, exceptions.AuthenticationFailed)):
        return _error_response(
            'UNAUTHORIZED',
            '身份认证信息无效或已过期',
            {},
            request_id,
            status.HTTP_401_UNAUTHORIZED,
        )
    if isinstance(exc, exceptions.PermissionDenied):
        return _error_response(
            'FORBIDDEN',
            '没有执行该操作的权限',
            {},
            request_id,
            status.HTTP_403_FORBIDDEN,
        )
    if isinstance(exc, (exceptions.NotFound, Http404)):
        return _error_response(
            'NOT_FOUND',
            '资源不存在',
            {},
            request_id,
            status.HTTP_404_NOT_FOUND,
        )
    if isinstance(exc, IntegrityError):
        return _error_response(
            'CONFLICT',
            '资源状态冲突',
            {},
            request_id,
            status.HTTP_409_CONFLICT,
        )

    response = drf_exception_handler(exc, context)
    if response is not None:
        return _error_response(
            'API_ERROR',
            '请求处理失败',
            _normalize_errors(response.data),
            request_id,
            response.status_code,
        )
    return _error_response(
        'INTERNAL_ERROR',
        '服务器内部错误',
        {},
        request_id,
        status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


def _error_response(code, message, errors, request_id, status_code):
    return Response(
        {
            'code': code,
            'message': message,
            'errors': errors,
            'request_id': request_id,
        },
        status=status_code,
    )


def _normalize_errors(detail):
    if isinstance(detail, dict):
        normalized = {}
        for field, messages in detail.items():
            if isinstance(messages, (list, tuple)):
                normalized[field] = [str(message) for message in messages]
            elif isinstance(messages, dict):
                normalized[field] = [str(messages)]
            else:
                normalized[field] = [str(messages)]
        return normalized
    if isinstance(detail, (list, tuple)):
        return {'non_field_errors': [str(message) for message in detail]}
    if detail:
        return {'non_field_errors': [str(detail)]}
    return {}
