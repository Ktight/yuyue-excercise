"""URLs exposed by the API."""

from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.responses import success_response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """Return a browsable API landing page."""
    return Response({'message': 'API is running'})


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return success_response(data={'status': 'healthy'})


urlpatterns = [
    path('', api_root, name='api-root'),
    path('health/', health_check, name='health-check'),
]
