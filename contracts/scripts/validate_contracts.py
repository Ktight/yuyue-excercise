"""Validate syntax, OpenAPI structure, refs, operation IDs, enums and examples."""

import ast
import copy
import json
from pathlib import Path

import yaml
from jsonschema import RefResolver, validate
from openapi_spec_validator import validate_spec


ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent


def resolve_pointer(document, pointer):
    value = document
    for part in pointer.removeprefix('#/').split('/'):
        value = value[part.replace('~1', '/').replace('~0', '~')]
    return value


def enum_choices_from_python(path):
    tree = ast.parse(path.read_text(encoding='utf-8'))
    result = {}
    for node in tree.body:
        if not isinstance(node, ast.ClassDef):
            continue
        values = {}
        choices = None
        for statement in node.body:
            if isinstance(statement, ast.Assign) and len(statement.targets) == 1 and isinstance(statement.targets[0], ast.Name):
                name = statement.targets[0].id
                if isinstance(statement.value, ast.Constant) and isinstance(statement.value.value, str):
                    values[name] = statement.value.value
                elif name == 'CHOICES' and isinstance(statement.value, (ast.Tuple, ast.List)):
                    choices = statement.value.elts
        if choices is not None:
            keys = []
            for pair in choices:
                first = pair.elts[0]
                keys.append(values[first.id] if isinstance(first, ast.Name) else first.value)
            result[node.name] = keys
    return result


def json_schema_compatible(value):
    """Translate OpenAPI 3.0 nullable into JSON Schema's null union."""
    value = copy.deepcopy(value)
    if isinstance(value, dict):
        if value.pop('nullable', False):
            declared = value.get('type')
            if declared:
                value['type'] = [declared, 'null']
        for child in value.values():
            json_schema_compatible_in_place(child)
    return value


def json_schema_compatible_in_place(value):
    if isinstance(value, dict):
        if value.pop('nullable', False):
            declared = value.get('type')
            if declared:
                value['type'] = [declared, 'null']
            else:
                original = copy.deepcopy(value)
                value.clear()
                value['anyOf'] = [original, {'type': 'null'}]
                return
        for child in value.values():
            json_schema_compatible_in_place(child)
    elif isinstance(value, list):
        for child in value:
            json_schema_compatible_in_place(child)


def main():
    spec = yaml.safe_load((ROOT / 'openapi.yaml').read_text(encoding='utf-8'))
    validate_spec(spec)

    operation_ids = []
    for path, item in spec['paths'].items():
        if not path.startswith('/api/') or not path.endswith('/'):
            raise AssertionError(f'invalid API path: {path}')
        for method, operation in item.items():
            if method.lower() in {'get', 'post', 'patch', 'put', 'delete'}:
                operation_ids.append(operation['operationId'])
                if 'x-roles' not in operation or 'x-tenant-scope' not in operation:
                    raise AssertionError(f'missing permission metadata: {method} {path}')
    if len(operation_ids) != len(set(operation_ids)):
        raise AssertionError('duplicate operationId')

    def walk(value):
        if isinstance(value, dict):
            if '$ref' in value:
                ref = value['$ref']
                if not ref.startswith('#/'):
                    raise AssertionError(f'external ref remains: {ref}')
                resolve_pointer(spec, ref)
            for child in value.values():
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)
    walk(spec)

    enums = json.loads((ROOT / 'enums.json').read_text(encoding='utf-8'))
    python_enums = enum_choices_from_python(REPO / 'backend' / 'core' / 'constants.py')
    for name, entries in enums.items():
        if name not in python_enums or list(entries) != python_enums[name]:
            raise AssertionError(f'enum drift: {name}')

    examples = list((ROOT / 'examples').rglob('*.json'))
    json_spec = json_schema_compatible(spec)
    resolver = RefResolver.from_schema(json_spec)
    schemas = json_spec['components']['schemas']
    phase_two_schemas = {
        'auth/login.request.json': 'LoginRequest',
        'auth/login.success.json': 'LoginSuccessResponse',
        'auth/refresh.request.json': 'TokenRefreshRequest',
        'auth/refresh.success.json': 'TokenRefreshSuccessResponse',
        'auth/logout.request.json': 'LogoutRequest',
        'auth/logout.success.json': 'EmptySuccessResponse',
        'auth/me.success.json': 'UserSuccessResponse',
        'auth/change-password.success.json': 'EmptySuccessResponse',
        'users/list.success.json': 'UserListSuccessResponse',
        'users/detail.success.json': 'UserSuccessResponse',
        'users/create.request.json': 'UserCreateRequest',
        'users/create.success.json': 'UserSuccessResponse',
        'users/reset-password.request.json': 'ResetPasswordRequest',
        'users/reset-password.success.json': 'EmptySuccessResponse',
        'companies/list.success.json': 'CompanyListSuccessResponse',
        'companies/detail.success.json': 'CompanySuccessResponse',
        'companies/create.request.json': 'CompanyCreateRequest',
        'companies/create.success.json': 'CompanySuccessResponse',
        'companies/update.request.json': 'CompanyUpdateRequest',
        'companies/update.success.json': 'CompanySuccessResponse',
        'stores/list.success.json': 'StoreListSuccessResponse',
        'stores/detail.success.json': 'StoreSuccessResponse',
        'stores/create.request.json': 'StoreCreateRequest',
        'stores/create.success.json': 'StoreSuccessResponse',
        'stores/update.request.json': 'StoreUpdateRequest',
        'stores/update.success.json': 'StoreSuccessResponse',
        'rooms/list.success.json': 'RoomListSuccessResponse',
        'rooms/detail.success.json': 'RoomSuccessResponse',
        'rooms/create.request.json': 'RoomCreateRequest',
        'rooms/create.success.json': 'RoomSuccessResponse',
        'rooms/update.request.json': 'RoomUpdateRequest',
        'rooms/update.success.json': 'RoomSuccessResponse',
        'course-templates/list.success.json': 'CourseTemplateListSuccessResponse',
        'course-templates/detail.success.json': 'CourseTemplateSuccessResponse',
        'course-templates/create.request.json': 'CourseTemplateCreateRequest',
        'course-templates/create.success.json': 'CourseTemplateSuccessResponse',
        'course-templates/update.request.json': 'CourseTemplateUpdateRequest',
        'course-templates/update.success.json': 'CourseTemplateSuccessResponse',
        'students/list.success.json': 'StudentListSuccessResponse',
        'students/detail.success.json': 'StudentSuccessResponse',
        'students/create.request.json': 'StudentCreateRequest',
        'students/create.success.json': 'StudentSuccessResponse',
        'students/update.request.json': 'StudentUpdateRequest',
        'students/update.success.json': 'StudentSuccessResponse',
        'students/membership.update.request.json': 'MembershipUpdateRequest',
        'students/membership.success.json': 'MembershipSuccessResponse',
        'students/eligibility.success.json': 'StudentEligibilitySuccessResponse',
        'body-assessments/list.success.json': 'BodyAssessmentListSuccessResponse',
        'body-assessments/detail.success.json': 'BodyAssessmentSuccessResponse',
        'body-assessments/create.request.json': 'BodyAssessmentCreateRequest',
        'body-assessments/create.success.json': 'BodyAssessmentSuccessResponse',
        'body-assessments/update.request.json': 'BodyAssessmentUpdateRequest',
        'body-assessments/update.success.json': 'BodyAssessmentSuccessResponse',
        'body-assessments/trend.success.json': 'BodyAssessmentTrendSuccessResponse',
        'schedules/list.success.json': 'ScheduleListSuccessResponse',
        'schedules/detail.success.json': 'ScheduleSuccessResponse',
        'schedules/create.request.json': 'ScheduleCreateRequest',
        'schedules/create.success.json': 'ScheduleCreateSuccessResponse',
        'schedules/update.request.json': 'ScheduleUpdateRequest',
        'schedules/update.success.json': 'ScheduleSuccessResponse',
        'bookings/list.success.json': 'BookingListSuccessResponse',
        'bookings/detail.success.json': 'BookingSuccessResponse',
        'bookings/create.request.json': 'BookingCreateRequest',
        'bookings/create.success.json': 'BookingSuccessResponse',
        'attendance/list.success.json': 'AttendanceListSuccessResponse',
        'attendance/detail.success.json': 'AttendanceSuccessResponse',
        'attendance/auto-create.request.json': 'AttendanceScheduleRequest',
        'attendance/auto-create.success.json': 'AttendanceAutoCreateSuccessResponse',
        'attendance/batch-check-in.request.json': 'AttendanceBatchCheckInRequest',
        'attendance/batch-check-in.success.json': 'AttendanceBatchSuccessResponse',
        'attendance/check-in.success.json': 'AttendanceSuccessResponse',
        'attendance/mark-leave.success.json': 'AttendanceSuccessResponse',
        'attendance/stats.success.json': 'AttendanceStatsSuccessResponse',
    }
    for example in examples:
        value = json.loads(example.read_text(encoding='utf-8'))
        relative = example.relative_to(ROOT / 'examples').as_posix()
        if relative in phase_two_schemas:
            schema_name = phase_two_schemas[relative]
        elif example.name.endswith('.request.json'):
            schema_name = 'DraftWriteRequest'
        elif example.name == 'list.success.json':
            schema_name = 'DraftListSuccessResponse'
        elif example.name.endswith('.success.json'):
            schema_name = 'DraftSuccessResponse'
        else:
            schema_name = 'ErrorResponse'
        validate(value, schemas[schema_name], resolver=resolver)

    print(f'OpenAPI valid: {len(spec["paths"])} paths, {len(operation_ids)} operations')
    print(f'Enums synchronized: {len(enums)}')
    print(f'Examples schema-valid: {len(examples)}')


if __name__ == '__main__':
    main()
