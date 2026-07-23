from django.utils import timezone
from rest_framework import serializers, status, viewsets
from rest_framework.exceptions import NotFound
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.views import APIView

from apps.members.models import StudentProfile
from core.constants import UserRole
from core.mixins import ContractResponseMixin
from core.permissions import IsTrainer
from core.responses import success_response

from .models import StudentFeedback
from .serializers import (
    StudentFeedbackCreateSerializer,
    StudentFeedbackSerializer,
)
from .services import create_student_feedback, generate_report_data


class StudentFeedbackPermission(BasePermission):
    """Students submit/read their feedback; staff have scoped read access."""

    def has_permission(self, request, view):
        role = getattr(request.user, 'role', None)
        if request.method in SAFE_METHODS:
            return role == UserRole.STUDENT or role in IsTrainer.allowed_roles
        return role == UserRole.STUDENT

    def has_object_permission(self, request, view, obj):
        if request.method not in SAFE_METHODS:
            return obj.student_id == request.user.id
        if request.user.role == UserRole.STUDENT:
            return obj.student_id == request.user.id
        if request.user.role == UserRole.TRAINER:
            return obj.class_record.trainer_id == request.user.id
        return True


class StudentFeedbackViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'head', 'options']
    serializer_class = StudentFeedbackSerializer
    permission_classes = [StudentFeedbackPermission]
    queryset = StudentFeedback.objects.select_related(
        'company',
        'class_record',
        'class_record__trainer',
        'class_record__store',
        'student',
    )

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentFeedbackCreateSerializer
        return StudentFeedbackSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.role == UserRole.SUPER_ADMIN:
            company_id = self.request.query_params.get('company_id')
            if company_id:
                company_id = serializers.IntegerField(
                    min_value=1
                ).run_validation(company_id)
                queryset = queryset.filter(company_id=company_id)
        else:
            queryset = queryset.filter(company_id=user.company_id)

        if user.role == UserRole.STUDENT:
            queryset = queryset.filter(student=user)
        elif user.role == UserRole.TRAINER:
            queryset = queryset.filter(class_record__trainer=user)
        elif user.role == UserRole.STORE_MANAGER:
            queryset = queryset.filter(class_record__store_id=user.store_id)

        class_record_id = (
            self.request.query_params.get('class_record_id')
            or self.request.query_params.get('class_record')
        )
        if class_record_id:
            class_record_id = serializers.IntegerField(
                min_value=1
            ).run_validation(class_record_id)
            queryset = queryset.filter(class_record_id=class_record_id)
        student_id = self.request.query_params.get('student_id')
        if student_id:
            student_id = serializers.IntegerField(
                min_value=1
            ).run_validation(student_id)
            queryset = queryset.filter(student_id=student_id)
        return queryset.order_by('-created_at', '-id')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        feedback = create_student_feedback(
            request.user,
            serializer.validated_data,
        )
        return success_response(
            data=StudentFeedbackSerializer(
                feedback,
                context=self.get_serializer_context(),
            ).data,
            status=status.HTTP_201_CREATED,
        )


class ReportPermission(BasePermission):
    def has_permission(self, request, view):
        role = getattr(request.user, 'role', None)
        return role == UserRole.STUDENT or role in IsTrainer.allowed_roles


class ReportQuerySerializer(serializers.Serializer):
    student_id = serializers.IntegerField(min_value=1)
    start = serializers.DateField()
    end = serializers.DateField()

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if attrs['end'] < attrs['start']:
            raise serializers.ValidationError(
                {'end': ['结束日期不能早于开始日期。']}
            )
        if attrs['end'] > timezone.localdate():
            raise serializers.ValidationError(
                {'end': ['结束日期不能晚于今天。']}
            )
        # The endpoints are inclusive, so a 366-day range has a 365-day
        # difference between its endpoints.
        if (attrs['end'] - attrs['start']).days >= 366:
            raise serializers.ValidationError(
                {'end': ['报告时间范围不能超过 366 天。']}
            )
        return attrs


class ReportView(APIView):
    permission_classes = [ReportPermission]

    def get(self, request):
        query = ReportQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        student_id = query.validated_data['student_id']
        start_date = query.validated_data['start']
        end_date = query.validated_data['end']

        try:
            profile = StudentProfile.objects.select_related(
                'user',
                'primary_trainer',
            ).get(user_id=student_id)
        except StudentProfile.DoesNotExist:
            raise NotFound('学员不存在。') from None

        user = request.user
        if (
            user.role != UserRole.SUPER_ADMIN
            and profile.company_id != user.company_id
        ):
            raise NotFound('学员不存在。')
        visible = True
        if user.role == UserRole.STUDENT:
            visible = profile.user_id == user.id
        elif user.role == UserRole.TRAINER:
            visible = profile.primary_trainer_id == user.id
        elif user.role == UserRole.STORE_MANAGER:
            visible = (
                user.store_id is not None
                and profile.home_store_id == user.store_id
            )
        if not visible:
            raise NotFound('学员不存在。')

        response = success_response(
            data=generate_report_data(
                student_id,
                start_date,
                end_date,
            )
        )
        response['Cache-Control'] = 'private, no-store'
        return response
