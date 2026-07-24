from django.http import Http404
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from core.constants import UserRole
from core.pagination import ContractPageNumberPagination
from core.responses import success_response

from .serializers import (
    AdminDashboardSerializer,
    ReminderQuerySerializer,
    ReminderSerializer,
)
from .services import (
    get_admin_dashboard,
    get_reminders,
    update_reminder_state,
)


MANAGEMENT_ROLES = {
    UserRole.SUPER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.STORE_MANAGER,
}


class ManagementAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        if request.user.role not in MANAGEMENT_ROLES:
            raise PermissionDenied('当前角色无权访问管理分析功能。')
        if (
            request.user.role != UserRole.SUPER_ADMIN
            and request.user.company_id is None
        ):
            raise PermissionDenied('当前账号尚未关联公司。')
        if (
            request.user.role == UserRole.STORE_MANAGER
            and request.user.store_id is None
        ):
            raise PermissionDenied('门店经理尚未关联门店。')


class AdminDashboardView(ManagementAPIView):
    def get(self, request):
        serializer = AdminDashboardSerializer(
            instance=get_admin_dashboard(request.user)
        )
        return success_response(data=serializer.data)


class ReminderListView(ManagementAPIView):
    def get(self, request):
        query = ReminderQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        reminders = get_reminders(
            request.user,
            unread_only=query.validated_data['unread_only'],
        )
        paginator = ContractPageNumberPagination()
        page = paginator.paginate_queryset(reminders, request, view=self)
        serializer = ReminderSerializer(instance=page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ReminderStateView(ManagementAPIView):
    state_field = ''

    def post(self, request, reminder_id):
        reminder = update_reminder_state(
            request.user,
            reminder_id,
            self.state_field,
        )
        if reminder is None:
            raise Http404
        serializer = ReminderSerializer(instance=reminder)
        return success_response(data=serializer.data)


class ReminderReadView(ReminderStateView):
    state_field = 'is_read'


class ReminderDismissView(ReminderStateView):
    state_field = 'is_dismissed'
