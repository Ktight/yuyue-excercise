"""Project middleware components."""

import uuid


class RequestIDMiddleware:
    """Attach a stable request identifier to requests and responses."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.request_id = f'req_{uuid.uuid4().hex}'
        response = self.get_response(request)
        response['X-Request-ID'] = request.request_id
        return response
