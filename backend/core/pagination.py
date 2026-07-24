"""Contract-compatible pagination for API list endpoints."""

from rest_framework.exceptions import ValidationError
from rest_framework.pagination import BasePagination

from core.responses import success_response


class ContractPageNumberPagination(BasePagination):
    """Expose items/page/page_size/total instead of DRF's default shape."""

    page_query_param = 'page'
    page_size_query_param = 'page_size'
    page_size = 20
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        self.request = request
        self.page_number = self._positive_integer(
            request.query_params.get(self.page_query_param, 1),
            self.page_query_param,
        )
        self.current_page_size = self._positive_integer(
            request.query_params.get(self.page_size_query_param, self.page_size),
            self.page_size_query_param,
        )
        if self.current_page_size > self.max_page_size:
            raise ValidationError(
                {self.page_size_query_param: [f'不得大于 {self.max_page_size}。']}
            )

        self.total = (
            queryset.count()
            if hasattr(queryset, 'model')
            else len(queryset)
        )
        offset = (self.page_number - 1) * self.current_page_size
        if offset >= self.total:
            return []
        return list(queryset[offset:offset + self.current_page_size])

    def get_paginated_response(self, data):
        return success_response(
            data={
                'items': data,
                'page': self.page_number,
                'page_size': self.current_page_size,
                'total': self.total,
            }
        )

    @staticmethod
    def _positive_integer(value, field_name):
        try:
            parsed = int(value)
        except (TypeError, ValueError):
            raise ValidationError({field_name: ['必须为整数。']}) from None
        if parsed < 1:
            raise ValidationError({field_name: ['必须大于或等于 1。']})
        return parsed
