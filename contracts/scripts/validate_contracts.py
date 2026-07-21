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
        'auth/me.success.json': 'UserSuccessResponse',
        'auth/change-password.success.json': 'EmptySuccessResponse',
        'users/list.success.json': 'UserListSuccessResponse',
        'users/detail.success.json': 'UserSuccessResponse',
        'users/create.request.json': 'UserCreateRequest',
        'users/create.success.json': 'UserSuccessResponse',
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
