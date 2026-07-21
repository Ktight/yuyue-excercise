"""Bundle modular contracts sources into one self-contained OpenAPI document."""

from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src'
RESPONSE_NAMES = {'BadRequest', 'Unauthorized', 'Forbidden', 'NotFound', 'Conflict', 'ServerError'}


def rewrite_refs(value, source_kind):
    if isinstance(value, dict):
        if '$ref' in value:
            ref = value['$ref']
            name = ref.rsplit('/', 1)[-1]
            if ref.startswith('#/'):
                value['$ref'] = f'#/components/schemas/{name}'
            elif 'root.yaml#/components/parameters/' in ref:
                value['$ref'] = f'#/components/parameters/{name}'
            elif '.yaml#/' in ref:
                section = 'responses' if name in RESPONSE_NAMES else 'schemas'
                value['$ref'] = f'#/components/{section}/{name}'
        for child in value.values():
            rewrite_refs(child, source_kind)
    elif isinstance(value, list):
        for child in value:
            rewrite_refs(child, source_kind)


def load_yaml(path):
    with path.open(encoding='utf-8') as stream:
        return yaml.safe_load(stream) or {}


def main():
    root = load_yaml(SOURCE / 'root.yaml')
    root['paths'] = {}
    root['components']['schemas'] = {}

    for path in sorted((SOURCE / 'schemas').glob('*.yaml')):
        document = load_yaml(path)
        for name, schema in document.items():
            if name in RESPONSE_NAMES:
                continue
            rewrite_refs(schema, 'schema')
            root['components']['schemas'][name] = schema

    common = load_yaml(SOURCE / 'schemas' / 'common.yaml')
    root['components']['responses'] = {}
    for name in RESPONSE_NAMES:
        response = common[name]
        rewrite_refs(response, 'response')
        root['components']['responses'][name] = response

    for path in sorted((SOURCE / 'paths').glob('*.yaml')):
        document = load_yaml(path)
        rewrite_refs(document, 'path')
        overlap = set(root['paths']).intersection(document)
        if overlap:
            raise ValueError(f'duplicate paths in {path.name}: {sorted(overlap)}')
        root['paths'].update(document)

    rewrite_refs(root['components']['parameters'], 'parameter')
    (ROOT / 'openapi.yaml').write_text(
        yaml.safe_dump(root, allow_unicode=True, sort_keys=False, width=120),
        encoding='utf-8',
    )


if __name__ == '__main__':
    main()
