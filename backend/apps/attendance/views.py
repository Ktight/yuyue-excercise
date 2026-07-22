from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from apps.accounts.models import User
from apps.courses.models import CourseSchedule
from core.constants import UserRole
from core.mixins import ContractResponseMixin
from core.permissions import IsTrainer
from core.responses import success_response

from .models import Attendance
from .serializers import AttendanceSerializer
from .services import (
    auto_create_attendance_for_schedule,
    batch_check_in,
    check_in,
    get_schedule_attendance_stats,
    get_student_attendance_stats,
    mark_leave,
)


class AttendanceViewSet(ContractResponseMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    queryset = Attendance.objects.select_related(
        'booking',
        'schedule',
        'schedule__course_template',
        'student',
        'checked_by',
    )

    def get_queryset(self):
        queryset = self._visible_attendances()
        schedule_id = (
            self.request.query_params.get('schedule_id')
            or self.request.query_params.get('schedule')
        )
        if schedule_id:
            queryset = queryset.filter(schedule_id=schedule_id)
        return queryset.order_by('schedule__course_date', 'schedule__start_time', 'id')

    def _visible_attendances(self):
        queryset = super().get_queryset()
        user = self.request.user
        if user.role == UserRole.SUPER_ADMIN:
            requested_company = self.request.query_params.get('company_id')
            if requested_company:
                queryset = queryset.filter(company_id=requested_company)
        else:
            queryset = queryset.filter(company_id=user.company_id)
        if user.role == UserRole.STUDENT:
            queryset = queryset.filter(student=user)
        return queryset

    @staticmethod
    def _require_trainer(user):
        if user.role not in IsTrainer.allowed_roles:
            raise PermissionDenied('该操作仅限训练师及以上角色。')

    @action(detail=True, methods=['post'], url_path='check-in')
    def check_in(self, request, pk=None):
        attendance = self.get_object()
        if request.user.role != UserRole.STUDENT:
            self._require_trainer(request.user)
        attendance = check_in(attendance.id, request.user)
        return success_response(data=self.get_serializer(attendance).data)

    @action(detail=False, methods=['post'], url_path='batch-check-in')
    def batch_check_in(self, request):
        self._require_trainer(request.user)
        schedule_id = request.data.get('schedule_id')
        if not schedule_id:
            raise serializers.ValidationError(
                {'schedule_id': ['必须指定排课。']}
            )
        student_ids = request.data.get('student_ids')
        if (
            not isinstance(student_ids, list)
            or not student_ids
            or any(type(student_id) is not int or student_id < 1 for student_id in student_ids)
        ):
            raise serializers.ValidationError(
                {'student_ids': ['必须是非空的正整数数组。']}
            )
        self._get_schedule(schedule_id, request.user)
        attendances = batch_check_in(schedule_id, student_ids, request.user)
        return success_response(
            data={
                'updated_count': len(attendances),
                'items': self.get_serializer(attendances, many=True).data,
            }
        )

    @action(detail=True, methods=['post'], url_path='mark-leave')
    def mark_leave(self, request, pk=None):
        self._require_trainer(request.user)
        attendance = self.get_object()
        attendance = mark_leave(attendance.id)
        return success_response(data=self.get_serializer(attendance).data)

    @action(detail=False, methods=['post'], url_path='auto-create')
    def auto_create(self, request):
        self._require_trainer(request.user)
        schedule_id = request.data.get('schedule_id')
        if not schedule_id:
            raise serializers.ValidationError(
                {'schedule_id': ['必须指定排课。']}
            )
        schedule = self._get_schedule(schedule_id, request.user)
        created_count = auto_create_attendance_for_schedule(schedule)
        return success_response(data={'created_count': created_count})

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        student_id = request.query_params.get('student_id')
        schedule_id = request.query_params.get('schedule_id')
        if not student_id and not schedule_id:
            raise serializers.ValidationError(
                {'non_field_errors': ['必须提供 student_id 或 schedule_id。']}
            )

        user = request.user
        if user.role == UserRole.STUDENT:
            if schedule_id:
                raise PermissionDenied('学员无权查看课程维度考勤统计。')
            if student_id and str(student_id) != str(user.id):
                raise PermissionDenied('学员只能查看自己的考勤统计。')
            student_id = user.id
        else:
            self._require_trainer(user)

        visible_attendances = self._visible_attendances()
        data = {}
        if student_id:
            student = self._get_student(student_id, user)
            data['student_stats'] = get_student_attendance_stats(
                visible_attendances,
                student.id,
            )
        if schedule_id:
            schedule = self._get_schedule(schedule_id, user)
            data['course_stats'] = get_schedule_attendance_stats(
                schedule,
                visible_attendances,
            )
        return success_response(data=data)

    @staticmethod
    def _get_schedule(schedule_id, user):
        queryset = CourseSchedule.objects.all()
        if user.role != UserRole.SUPER_ADMIN:
            queryset = queryset.filter(company_id=user.company_id)
        try:
            return queryset.get(pk=schedule_id)
        except CourseSchedule.DoesNotExist:
            raise serializers.ValidationError(
                {'schedule_id': ['排课不存在或不在当前公司。']}
            ) from None

    @staticmethod
    def _get_student(student_id, user):
        queryset = User.objects.filter(role=UserRole.STUDENT)
        if user.role != UserRole.SUPER_ADMIN:
            queryset = queryset.filter(company_id=user.company_id)
        try:
            return queryset.get(pk=student_id)
        except (User.DoesNotExist, ValueError, TypeError):
            raise serializers.ValidationError(
                {'student_id': ['学员不存在或不在当前公司。']}
            ) from None
