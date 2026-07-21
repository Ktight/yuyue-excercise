"""Project middleware components."""

import uuid

from django.utils.deprecation import MiddlewareMixin


class TenantMiddleware(MiddlewareMixin):
    """Expose the authenticated user's tenant on API requests."""

    def process_request(self, request):
        if not request.path.startswith('/api/'):
            return None

        request.company_id = None
        user = getattr(request, 'user', None)
        if user is not None and user.is_authenticated:
            request.company_id = getattr(user, 'company_id', None)

        return None


class RequestIDMiddleware:
    """Attach a stable request identifier to requests and responses."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.request_id = f'req_{uuid.uuid4().hex}'
        response = self.get_response(request)
        response['X-Request-ID'] = request.request_id
        return response
