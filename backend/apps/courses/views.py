from django.db.models import Count, Q
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_201_CREATED
from rest_framework.views import APIView

from core.constants import CourseCategory, CourseDifficulty, ResourceStatus, UserRole
from core.mixins import ContractResponseMixin
from core.permissions import IsCompanyAdmin, IsStoreManager, IsTrainer
from core.responses import success_response

from .models import CourseBooking, CourseSchedule, CourseTemplate
from .serializers import (
    BookingSerializer,
    CourseScheduleCreateSerializer,
    CourseScheduleSerializer,
    CourseTemplateSerializer,
)
from .services import cancel_booking, create_booking, create_recurring_schedules


class CourseTemplateViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    queryset = CourseTemplate.objects.all()
    serializer_class = CourseTemplateSerializer

    def get_permissions(self):
        permission_classes = (
            [IsTrainer]
            if self.action in {'list', 'retrieve'}
            else [IsCompanyAdmin]
        )
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        requested_company = self.request.query_params.get('company_id')
        if user.role == UserRole.SUPER_ADMIN:
            if requested_company:
                queryset = queryset.filter(company_id=requested_company)
        else:
            if requested_company and str(requested_company) != str(user.company_id):
                raise PermissionDenied('不能筛选其他公司的课程模板。')
            queryset = queryset.filter(company_id=user.company_id)

        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        filters = {
            'category': {value for value, _ in CourseCategory.CHOICES},
            'difficulty': {value for value, _ in CourseDifficulty.CHOICES},
            'status': {value for value, _ in ResourceStatus.CHOICES},
        }
        for field, allowed in filters.items():
            value = self.request.query_params.get(field)
            if value:
                if value not in allowed:
                    raise serializers.ValidationError(
                        {field: ['无效的筛选值。']}
                    )
                queryset = queryset.filter(**{field: value})
        ordering = self.request.query_params.get('ordering')
        allowed_ordering = {
            'category', '-category', 'name', '-name',
            'created_at', '-created_at', 'updated_at', '-updated_at',
        }
        if ordering:
            if ordering not in allowed_ordering:
                raise serializers.ValidationError(
                    {'ordering': ['不支持的排序字段。']}
                )
            queryset = queryset.order_by(ordering)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前操作者未关联公司。']}
            )
        serializer.save(company_id=self.request.user.company_id)

    def perform_update(self, serializer):
        if serializer.instance.company.status != ResourceStatus.ACTIVE:
            raise serializers.ValidationError(
                {'company': ['公司已停用，不能修改课程模板。']}
            )
        serializer.save()


class CourseScheduleViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    queryset = CourseSchedule.objects.select_related(
        'course_template',
        'trainer',
        'room',
        'store',
    ).all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CourseScheduleCreateSerializer
        return CourseScheduleSerializer

    def get_permissions(self):
        if self.action in {'book', 'cancel_booking'}:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = (
                [IsStoreManager] if self.action == 'create' else [IsTrainer]
            )
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset().annotate(bookings_count=Count('bookings'))
        user = self.request.user
        requested_company = self.request.query_params.get('company_id')
        if user.role == UserRole.SUPER_ADMIN:
            if requested_company:
                queryset = queryset.filter(company_id=requested_company)
        else:
            if requested_company and str(requested_company) != str(user.company_id):
                raise PermissionDenied('不能筛选其他公司的排课。')
            queryset = queryset.filter(company_id=user.company_id)

        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(course_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(course_date__lte=date_to)

        direct_filters = {
            'store_id': 'store_id',
            'trainer_id': 'trainer_id',
            'status': 'status',
        }
        for parameter, field in direct_filters.items():
            value = self.request.query_params.get(parameter)
            if value:
                queryset = queryset.filter(**{field: value})

        course_type = self.request.query_params.get('course_type')
        if course_type:
            allowed = {value for value, _ in CourseCategory.CHOICES}
            if course_type not in allowed:
                raise serializers.ValidationError(
                    {'course_type': ['无效的课程类型。']}
                )
            queryset = queryset.filter(course_template__category=course_type)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        company_id = request.user.company_id
        if company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前操作者未关联公司。']}
            )

        if serializer.validated_data.get('schedule_mode') == 'recurring':
            base_data = dict(serializer.validated_data)
            end_date = base_data.pop('end_date', None)
            recurring_rule = base_data.pop('recurring_rule')
            base_data.pop('schedule_mode', None)
            base_data['company_id'] = company_id
            created_count = create_recurring_schedules(
                base_data,
                recurring_rule,
                end_date,
            )
            return success_response(
                data={'created_count': created_count},
                status=HTTP_201_CREATED,
            )

        self.perform_create(serializer)
        output = CourseScheduleSerializer(
            serializer.instance,
            context=self.get_serializer_context(),
        )
        return success_response(data=output.data, status=HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(company_id=self.request.user.company_id)

    @action(detail=True, methods=['post'], url_path='book')
    def book(self, request, pk=None):
        return BookingCreateView.create_response(request, pk)

    @action(
        detail=True,
        methods=['delete'],
        url_path=r'bookings/(?P<booking_id>[^/.]+)',
    )
    def cancel_booking(self, request, pk=None, booking_id=None):
        return BookingCancelView.cancel_response(
            request,
            booking_id,
            schedule_id=pk,
        )


def _booking_student_id(request):
    user = request.user
    if user.role == UserRole.STUDENT:
        requested_student = request.data.get('student_id')
        if requested_student and str(requested_student) != str(user.id):
            raise PermissionDenied('学员只能为自己预约。')
        return user.id
    if user.role in IsTrainer.allowed_roles:
        student_id = request.data.get('student_id')
        if not student_id:
            raise serializers.ValidationError(
                {'student_id': ['训练师代理预约必须指定学员。']}
            )
        return student_id
    raise PermissionDenied('当前用户无预约权限。')


class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def create_response(request, schedule_id):
        if request.user.company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前用户未关联公司。']}
            )
        booking = create_booking(
            schedule_id=schedule_id,
            student_id=_booking_student_id(request),
            company_id=request.user.company_id,
        )
        return success_response(
            data=BookingSerializer(booking).data,
            status=HTTP_201_CREATED,
        )

    def post(self, request, schedule_id, *args, **kwargs):
        return self.create_response(request, schedule_id)


class BookingViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'delete', 'head', 'options']
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    queryset = CourseBooking.objects.select_related(
        'schedule',
        'schedule__course_template',
        'schedule__trainer',
        'schedule__room',
        'student',
    )

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if user.role == UserRole.STUDENT:
            return queryset.filter(student=user)
        if user.role == UserRole.TRAINER:
            return queryset.filter(
                company_id=user.company_id,
                schedule__trainer=user,
            )
        if user.role in IsTrainer.allowed_roles:
            return queryset.filter(company_id=user.company_id)
        return queryset.none()

    def create(self, request, *args, **kwargs):
        schedule_id = request.data.get('schedule_id')
        if not schedule_id:
            raise serializers.ValidationError(
                {'schedule_id': ['必须指定排课。']}
            )
        return BookingCreateView.create_response(request, schedule_id)

    @action(detail=True, methods=['delete'], url_path='cancel')
    def cancel(self, request, pk=None):
        return BookingCancelView.cancel_response(request, pk)


class BookingCancelView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def cancel_response(request, booking_id, schedule_id=None):
        if request.user.company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前用户未关联公司。']}
            )
        if request.user.role == UserRole.TRAINER:
            owns_booking = CourseBooking.objects.filter(
                pk=booking_id,
                company_id=request.user.company_id,
                schedule__trainer=request.user,
            ).exists()
            if not owns_booking:
                raise PermissionDenied('只能取消自己授课排课下的预约。')
        student_id = request.user.id if request.user.role == UserRole.STUDENT else None
        booking = cancel_booking(
            booking_id=booking_id,
            company_id=request.user.company_id,
            student_id=student_id,
            schedule_id=schedule_id,
        )
        return success_response(data=BookingSerializer(booking).data)

    def delete(self, request, booking_id, *args, **kwargs):
        return self.cancel_response(request, booking_id)
