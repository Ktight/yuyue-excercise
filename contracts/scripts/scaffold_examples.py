"""Create the minimum example matrix for every contract module."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULES = [
    'system', 'auth', 'users', 'companies', 'stores', 'rooms', 'course-templates',
    'students', 'body-assessments', 'schedules', 'bookings', 'attendance',
    'class-records', 'class-media', 'class-templates', 'training-plans', 'feedback',
    'reports', 'dashboards', 'reminders', 'student',
]

SUCCESS = {'code': 'OK', 'message': '', 'data': {}}
LIST = {'code': 'OK', 'message': '', 'data': {'items': [], 'page': 1, 'page_size': 20, 'total': 0}}
ERRORS = {
    'validation-error': {'code': 'VALIDATION_ERROR', 'message': '请求参数校验失败', 'errors': {'field': ['字段不合法']}, 'request_id': 'req_example'},
    'unauthorized': {'code': 'UNAUTHORIZED', 'message': '身份认证信息无效或已过期', 'errors': {}, 'request_id': 'req_example'},
    'forbidden': {'code': 'FORBIDDEN', 'message': '没有执行该操作的权限', 'errors': {}, 'request_id': 'req_example'},
    'not-found': {'code': 'NOT_FOUND', 'message': '资源不存在', 'errors': {}, 'request_id': 'req_example'},
    'conflict': {'code': 'CONFLICT', 'message': '资源状态冲突', 'errors': {}, 'request_id': 'req_example'},
}


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def main():
    for module in MODULES:
        directory = ROOT / 'examples' / module
        write(directory / 'list.success.json', LIST)
        write(directory / 'detail.success.json', SUCCESS)
        write(directory / 'create.request.json', {})
        write(directory / 'create.success.json', SUCCESS)
        write(directory / 'update.request.json', {})
        write(directory / 'update.success.json', SUCCESS)
        for name, value in ERRORS.items():
            write(directory / f'{name}.json', value)

    auth = ROOT / 'examples' / 'auth'
    user = {'id': 1, 'phone': '13900000000', 'name': '示例管理员', 'role': 'super_admin', 'avatar': None, 'company_id': None, 'store_id': None, 'is_active': True}
    write(auth / 'login.request.json', {'phone': '13900000000', 'password': 'ExamplePass123!'})
    write(auth / 'login.success.json', {'code': 'OK', 'message': '', 'data': {'access_token': '<jwt-access-token>', 'refresh_token': '<jwt-refresh-token>', 'token_type': 'Bearer', 'expires_in': 1800, 'refresh_expires_in': 604800, 'user': user}})
    write(auth / 'login.invalid-credentials.json', {'code': 'INVALID_CREDENTIALS', 'message': '手机号或密码错误', 'errors': {}, 'request_id': 'req_example'})
    write(auth / 'login.account-disabled.json', {'code': 'ACCOUNT_DISABLED', 'message': '账号已停用', 'errors': {}, 'request_id': 'req_example'})
    write(auth / 'refresh.request.json', {'refresh_token': '<jwt-refresh-token>'})
    write(auth / 'refresh.success.json', {'code': 'OK', 'message': '', 'data': {'access_token': '<new-jwt-access-token>', 'refresh_token': '<new-jwt-refresh-token>', 'token_type': 'Bearer', 'expires_in': 1800, 'refresh_expires_in': 604800}})
    write(auth / 'refresh.invalid.json', {'code': 'REFRESH_TOKEN_INVALID', 'message': 'Refresh Token 无效或已过期', 'errors': {}, 'request_id': 'req_example'})
    write(auth / 'me.success.json', {'code': 'OK', 'message': '', 'data': user})
    write(auth / 'change-password.success.json', {'code': 'OK', 'message': '密码修改成功', 'data': None})
    write(auth / 'change-password.old-password-error.json', {'code': 'OLD_PASSWORD_INCORRECT', 'message': '原密码不正确', 'errors': {'old_password': ['原密码不正确']}, 'request_id': 'req_example'})

    users = ROOT / 'examples' / 'users'
    trainer = {'id': 2, 'phone': '13800000000', 'name': '示例教练', 'role': 'trainer', 'avatar': None, 'company_id': 1, 'store_id': 10, 'is_active': True}
    write(users / 'list.success.json', {'code': 'OK', 'message': '', 'data': {'items': [trainer], 'page': 1, 'page_size': 20, 'total': 1}})
    write(users / 'detail.success.json', {'code': 'OK', 'message': '', 'data': trainer})
    create = {'phone': '13800000000', 'name': '示例教练', 'password': 'ChangeMe123!', 'role': 'trainer', 'store_id': 10, 'is_active': True}
    write(users / 'create.request.json', create)
    write(users / 'create.success.json', {'code': 'OK', 'message': '', 'data': trainer})
    write(users / 'create.validation-error.json', {'code': 'VALIDATION_ERROR', 'message': '请求参数校验失败', 'errors': {'phone': ['手机号格式不正确']}, 'request_id': 'req_example'})
    write(users / 'create.conflict.json', {'code': 'PHONE_ALREADY_EXISTS', 'message': '手机号已存在', 'errors': {'phone': ['该手机号已被使用。']}, 'request_id': 'req_example'})
    write(users / 'create.store-not-found.json', {'code': 'STORE_NOT_FOUND', 'message': '门店不存在', 'errors': {}, 'request_id': 'req_example'})
    write(users / 'forbidden.json', ERRORS['forbidden'])
    write(users / 'not-found.json', {'code': 'USER_NOT_FOUND', 'message': '用户不存在', 'errors': {}, 'request_id': 'req_example'})


if __name__ == '__main__':
    main()
