"""Helpers for the project's public response envelope."""

from rest_framework.response import Response


def success_payload(data=None, message=''):
    """Build the canonical success response payload."""
    return {
        'code': 'OK',
        'message': message,
        'data': data,
    }


def success_response(data=None, message='', status=200):
    """Return a DRF response using the canonical success envelope."""
    return Response(success_payload(data=data, message=message), status=status)
