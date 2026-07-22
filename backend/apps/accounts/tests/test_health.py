from django.test import override_settings
from rest_framework.test import APITestCase


@override_settings(ALLOWED_HOSTS=['testserver'])
class HealthCheckTests(APITestCase):
    def test_health_check_is_public_and_uses_contract_envelope(self):
        response = self.client.get('/api/health/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {
                'code': 'OK',
                'message': '',
                'data': {'status': 'healthy'},
            },
        )
