from datetime import timedelta

from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound

from core.constants import MemberCardType, UserRole
from core.mixins import ContractResponseMixin
from core.permissions import IsCompanyAdmin, IsStoreManager, IsTrainer
from core.responses import success_response

from .models import BodyAssessment, StudentProfile
from .serializers import (
    BodyAssessmentSerializer,
    MembershipSerializer,
    MembershipUpdateSerializer,
    StudentProfileCreateSerializer,
    StudentProfileSerializer,
)


def visible_students_for(user):
    queryset = StudentProfile.objects.select_related(
        'user', 'home_store', 'primary_trainer', 'company'
    ).prefetch_related('assessments')
    if user.role == UserRole.SUPER_ADMIN:
        return queryset
    queryset = queryset.filter(company_id=user.company_id)
    if user.role == UserRole.STORE_MANAGER:
        return queryset.filter(home_store_id=user.store_id)
    if user.role == UserRole.TRAINER:
        # Historical class visibility will be added when attendance/training
        # models expose a student-to-trainer relation.
        return queryset.filter(primary_trainer=user)
    return queryset


class StudentProfileViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
    queryset = StudentProfile.objects.all()
    permission_classes = [IsTrainer]

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsCompanyAdmin()]
        if self.action == 'membership' and self.request.method == 'PATCH':
            return [IsStoreManager()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentProfileCreateSerializer
        return StudentProfileSerializer

    def get_queryset(self):
        queryset = visible_students_for(self.request.user)
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(user__name__icontains=search)
                | Q(user__phone__icontains=search)
            )

        today = timezone.localdate()
        account_status = self.request.query_params.get('status')
        if account_status in {'active', 'inactive'}:
            queryset = queryset.filter(user__is_active=account_status == 'active')
        elif account_status:
            raise serializers.ValidationError(
                {'status': ['只允许 active 或 inactive。']}
            )

        card_status = (
            self.request.query_params.get('membership_status')
            or self.request.query_params.get('member_card_status')
        )
        if card_status == 'expired':
            queryset = queryset.filter(member_card_expire__lt=today)
        elif card_status == 'valid':
            queryset = queryset.filter(
                member_card_start__lte=today,
                member_card_expire__gte=today,
                member_card_active=True,
            ).exclude(
                member_card_type__in=[MemberCardType.COUNT, MemberCardType.STORED],
                member_card_balance__lte=0,
            )
        elif card_status == 'insufficient':
            queryset = queryset.filter(
                member_card_type__in=[MemberCardType.COUNT, MemberCardType.STORED],
                member_card_balance__lte=0,
            )
        elif card_status:
            raise serializers.ValidationError(
                {'membership_status': ['只允许 valid、expired 或 insufficient。']}
            )

        store_id = self.request.query_params.get('store_id')
        if store_id:
            queryset = queryset.filter(home_store_id=store_id)
        trainer_id = self.request.query_params.get('trainer_id')
        if trainer_id:
            queryset = queryset.filter(primary_trainer_id=trainer_id)

        expiring_days = self.request.query_params.get('expiring_days')
        if expiring_days is not None:
            try:
                days = int(expiring_days)
            except ValueError:
                raise serializers.ValidationError(
                    {'expiring_days': ['必须为非负整数。']}
                ) from None
            if days < 0:
                raise serializers.ValidationError(
                    {'expiring_days': ['必须为非负整数。']}
                )
            queryset = queryset.filter(
                member_card_expire__gte=today,
                member_card_expire__lte=today + timedelta(days=days),
            )
        ordering = self.request.query_params.get('ordering', 'user__name')
        if ordering not in {
            'user__name', '-user__name',
            'member_card_expire', '-member_card_expire',
            'created_at', '-created_at',
        }:
            raise serializers.ValidationError(
                {'ordering': ['不支持的排序字段。']}
            )
        return queryset.order_by(ordering).distinct()

    @action(detail=True, methods=['get', 'patch'])
    def membership(self, request, *args, **kwargs):
        profile = self.get_object()
        if request.method == 'PATCH':
            serializer = MembershipUpdateSerializer(
                data=request.data,
                context={'profile': profile},
            )
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            profile.member_card_type = data.get(
                'card_type', profile.member_card_type
            )
            profile.member_card_start = data.get(
                'starts_on', profile.member_card_start
            )
            profile.member_card_expire = data.get(
                'expires_on', profile.member_card_expire
            )
            if 'remaining_count' in data:
                profile.member_card_balance = data['remaining_count']
            if 'balance_minor' in data:
                profile.member_card_balance = data['balance_minor']
            profile.member_card_active = data.get(
                'active', profile.member_card_active
            )
            profile.save()
        return success_response(
            data=MembershipSerializer.from_profile(profile)
        )

    @action(detail=True, methods=['get'])
    def eligibility(self, request, *args, **kwargs):
        from .services import get_student_eligibility

        return success_response(
            data=get_student_eligibility(self.get_object())
        )

    @action(detail=True, methods=['get'], url_path='body-assessment-trend')
    def body_assessment_trend(self, request, *args, **kwargs):
        profile = self.get_object()
        metric = request.query_params.get('metric', 'weight')
        allowed_metrics = {
            'height', 'weight', 'flexibility_score', 'core_strength_score'
        }
        if metric not in allowed_metrics:
            raise serializers.ValidationError(
                {'metric': ['不支持的趋势指标。']}
            )
        assessments = profile.assessments.order_by('assess_date', 'id')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if date_from:
            assessments = assessments.filter(assess_date__gte=date_from)
        if date_to:
            assessments = assessments.filter(assess_date__lte=date_to)
        points = [
            {
                'assessment_id': assessment.id,
                'assess_date': assessment.assess_date,
                'value': getattr(assessment, metric),
            }
            for assessment in assessments
            if getattr(assessment, metric) is not None
        ]
        return success_response(data={
            'student_id': profile.id,
            'metric': metric,
            'unit': {
                'height': 'cm',
                'weight': 'kg',
                'flexibility_score': 'score_1_10',
                'core_strength_score': 'score_1_10',
            }[metric],
            'has_trend': len(points) >= 2,
            'points': points,
        })


class BodyAssessmentViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    serializer_class = BodyAssessmentSerializer
    permission_classes = [IsTrainer]

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsCompanyAdmin()]
        return super().get_permissions()

    def get_student(self, student_id=None):
        student_id = student_id or self.kwargs.get('student_pk')
        try:
            return visible_students_for(self.request.user).get(
                pk=student_id
            )
        except StudentProfile.DoesNotExist:
            raise NotFound('学员不存在或不在可访问范围内。') from None

    def get_queryset(self):
        if self.kwargs.get('student_pk'):
            # A nested collection is still a resource access: an inaccessible
            # parent must be hidden as 404 instead of leaking an empty list.
            self.get_student(self.kwargs['student_pk'])
        queryset = BodyAssessment.objects.filter(
            student__in=visible_students_for(self.request.user)
        ).select_related('student', 'student__user')
        student_id = (
            self.kwargs.get('student_pk')
            or self.request.query_params.get('student_id')
        )
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        ordering = self.request.query_params.get('ordering', '-assess_date')
        if ordering not in {'assess_date', '-assess_date'}:
            raise serializers.ValidationError(
                {'ordering': ['只允许 assess_date 或 -assess_date。']}
            )
        return queryset.order_by(ordering, '-id')

    def perform_create(self, serializer):
        student_id = self.kwargs.get('student_pk') or self.request.data.get('student')
        if student_id is None:
            raise serializers.ValidationError(
                {'student': ['必须指定学员。']}
            )
        serializer.save(student=self.get_student(student_id))
