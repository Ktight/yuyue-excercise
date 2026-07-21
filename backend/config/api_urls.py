"""URLs exposed by the API."""

from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    """Return a browsable API landing page."""
    return Response({'message': 'API is running'})


urlpatterns = [
    path('', api_root, name='api-root'),
]
