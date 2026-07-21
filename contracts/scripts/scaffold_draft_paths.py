"""Generate DRAFT path modules from the reviewed all-project endpoint manifest."""

from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
PATHS = ROOT / 'src' / 'paths'

MODULES = {
    'system': [('GET', '/api/health/'), ('GET', '/api/version/')],
    'companies': [('GET', '/api/companies/'), ('POST', '/api/companies/'), ('GET', '/api/companies/{company_id}/'), ('PATCH', '/api/companies/{company_id}/'), ('POST', '/api/companies/{company_id}/activate/'), ('POST', '/api/companies/{company_id}/deactivate/')],
    'stores': [('GET', '/api/stores/'), ('POST', '/api/stores/'), ('GET', '/api/stores/{store_id}/'), ('PATCH', '/api/stores/{store_id}/'), ('POST', '/api/stores/{store_id}/activate/'), ('POST', '/api/stores/{store_id}/deactivate/')],
    'rooms': [('GET', '/api/rooms/'), ('POST', '/api/rooms/'), ('GET', '/api/rooms/{room_id}/'), ('PATCH', '/api/rooms/{room_id}/'), ('POST', '/api/rooms/{room_id}/activate/'), ('POST', '/api/rooms/{room_id}/deactivate/')],
    'course-templates': [('GET', '/api/course-templates/'), ('POST', '/api/course-templates/'), ('GET', '/api/course-templates/{template_id}/'), ('PATCH', '/api/course-templates/{template_id}/'), ('POST', '/api/course-templates/{template_id}/activate/'), ('POST', '/api/course-templates/{template_id}/deactivate/')],
    'students': [('GET', '/api/students/'), ('POST', '/api/students/'), ('GET', '/api/students/{student_id}/'), ('PATCH', '/api/students/{student_id}/'), ('GET', '/api/students/{student_id}/membership/'), ('PATCH', '/api/students/{student_id}/membership/'), ('GET', '/api/students/{student_id}/eligibility/')],
    'body-assessments': [('GET', '/api/body-assessments/'), ('POST', '/api/body-assessments/'), ('GET', '/api/body-assessments/{assessment_id}/'), ('PATCH', '/api/body-assessments/{assessment_id}/'), ('DELETE', '/api/body-assessments/{assessment_id}/'), ('GET', '/api/students/{student_id}/body-assessment-trend/')],
    'schedules': [('GET', '/api/schedules/'), ('POST', '/api/schedules/'), ('GET', '/api/schedules/{schedule_id}/'), ('PATCH', '/api/schedules/{schedule_id}/'), ('POST', '/api/schedules/{schedule_id}/publish/'), ('POST', '/api/schedules/{schedule_id}/cancel/'), ('POST', '/api/schedules/recurring/')],
    'bookings': [('GET', '/api/bookings/'), ('POST', '/api/bookings/'), ('GET', '/api/bookings/{booking_id}/'), ('POST', '/api/bookings/{booking_id}/confirm/'), ('POST', '/api/bookings/{booking_id}/cancel/')],
    'attendance': [('GET', '/api/attendance/'), ('POST', '/api/attendance/'), ('POST', '/api/attendance/bulk/'), ('PATCH', '/api/attendance/{attendance_id}/'), ('GET', '/api/attendance/statistics/')],
    'class-records': [('GET', '/api/class-records/'), ('POST', '/api/class-records/'), ('GET', '/api/class-records/{record_id}/'), ('PATCH', '/api/class-records/{record_id}/'), ('POST', '/api/class-records/{record_id}/complete/'), ('POST', '/api/class-records/bulk/')],
    'class-media': [('POST', '/api/uploads/presign/'), ('POST', '/api/uploads/{upload_id}/complete/'), ('DELETE', '/api/media/{media_id}/')],
    'class-templates': [('GET', '/api/class-templates/'), ('POST', '/api/class-templates/'), ('GET', '/api/class-templates/{template_id}/'), ('PATCH', '/api/class-templates/{template_id}/'), ('DELETE', '/api/class-templates/{template_id}/')],
    'training-plans': [('GET', '/api/training-plans/'), ('POST', '/api/training-plans/'), ('GET', '/api/training-plans/{plan_id}/'), ('PATCH', '/api/training-plans/{plan_id}/'), ('POST', '/api/training-plans/{plan_id}/activate/'), ('POST', '/api/training-plans/{plan_id}/complete/'), ('GET', '/api/training-plans/{plan_id}/progress/')],
    'feedback': [('GET', '/api/feedback/'), ('POST', '/api/feedback/'), ('GET', '/api/feedback/{feedback_id}/'), ('PATCH', '/api/feedback/{feedback_id}/')],
    'reports': [('POST', '/api/reports/preview/'), ('POST', '/api/reports/'), ('GET', '/api/reports/'), ('GET', '/api/reports/{report_id}/'), ('PATCH', '/api/reports/{report_id}/'), ('POST', '/api/reports/{report_id}/publish/'), ('POST', '/api/reports/{report_id}/export/'), ('POST', '/api/reports/{report_id}/share/'), ('DELETE', '/api/reports/{report_id}/share/')],
    'dashboards': [('GET', '/api/dashboards/admin/'), ('GET', '/api/dashboards/trainer/'), ('GET', '/api/dashboards/student/')],
    'reminders': [('GET', '/api/reminders/'), ('POST', '/api/reminders/{reminder_id}/read/'), ('POST', '/api/reminders/{reminder_id}/dismiss/')],
    'student-self-service': [('GET', '/api/student/home/'), ('GET', '/api/student/schedules/'), ('GET', '/api/student/bookings/'), ('POST', '/api/student/bookings/'), ('POST', '/api/student/bookings/{booking_id}/cancel/'), ('GET', '/api/student/profile/'), ('GET', '/api/student/body-assessments/'), ('GET', '/api/student/class-records/'), ('GET', '/api/student/training-plans/'), ('GET', '/api/student/reports/'), ('POST', '/api/student/feedback/')],
}

PUBLIC = {'/api/health/', '/api/version/'}
SELF_MODULES = {'student-self-service'}


def operation_id(method, path):
    words = [part.strip('{}').replace('-', '_') for part in path.split('/') if part and part != 'api']
    return method.lower() + ''.join(word.title().replace('_', '') for word in words)


def build_operation(module, method, path):
    is_list = method == 'GET' and '{' not in path and not path.endswith(('health/', 'version/'))
    op = {
        'operationId': operation_id(method, path),
        'tags': [module],
        'x-status': 'DRAFT',
        'x-roles': ['student'] if module in SELF_MODULES else ['super_admin', 'company_admin', 'store_manager', 'trainer'],
        'x-tenant-scope': 'self' if module in SELF_MODULES else ('none' if path in PUBLIC else 'company'),
        'description': 'DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。',
    }
    if path in PUBLIC:
        op['security'] = []
        op['x-roles'] = ['public']
    if method in {'POST', 'PATCH'}:
        op['requestBody'] = {
            'required': True,
            'content': {'application/json': {'schema': {'$ref': '../schemas/common.yaml#/DraftWriteRequest'}}},
        }
    schema = 'DraftListSuccessResponse' if is_list else ('EmptySuccessResponse' if method == 'DELETE' else 'DraftSuccessResponse')
    responses = {
        '200': {'description': '成功', 'content': {'application/json': {'schema': {'$ref': f'../schemas/common.yaml#/{schema}'}}}},
        '400': {'$ref': '../schemas/common.yaml#/BadRequest'},
        '401': {'$ref': '../schemas/common.yaml#/Unauthorized'},
        '403': {'$ref': '../schemas/common.yaml#/Forbidden'},
        '404': {'$ref': '../schemas/common.yaml#/NotFound'},
        '409': {'$ref': '../schemas/common.yaml#/Conflict'},
        '500': {'$ref': '../schemas/common.yaml#/ServerError'},
    }
    if method == 'POST' and path.endswith(('/companies/', '/stores/', '/rooms/', '/course-templates/', '/students/', '/body-assessments/', '/schedules/', '/bookings/', '/attendance/', '/class-records/', '/class-templates/', '/training-plans/', '/feedback/', '/reports/')):
        responses['201'] = responses.pop('200')
    op['responses'] = responses
    return op


def main():
    PATHS.mkdir(parents=True, exist_ok=True)
    for module, endpoints in MODULES.items():
        document = {}
        for method, path in endpoints:
            item = document.setdefault(path, {})
            for segment in path.split('/'):
                if segment.startswith('{'):
                    name = segment.strip('{}')
                    parameters = item.setdefault('parameters', [])
                    if not any(parameter['name'] == name for parameter in parameters):
                        parameters.append({
                            'name': name, 'in': 'path', 'required': True,
                            'schema': {'type': 'integer' if name != 'upload_id' else 'string', 'format': 'int64' if name != 'upload_id' else None, 'minimum': 1 if name != 'upload_id' else None},
                        })
            item[method.lower()] = build_operation(module, method, path)
        for item in document.values():
            for parameter in item.get('parameters', []):
                parameter['schema'] = {k: v for k, v in parameter['schema'].items() if v is not None}
        (PATHS / f'{module}.yaml').write_text(
            yaml.safe_dump(document, allow_unicode=True, sort_keys=False), encoding='utf-8'
        )


if __name__ == '__main__':
    main()
