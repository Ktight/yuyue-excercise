"""Training APIs."""

from pathlib import Path
from types import SimpleNamespace

from django.core.files.storage import Storage
from django.db.models import Q
from PIL import UnidentifiedImageError
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.views import APIView

from core.constants import UserRole
from core.exceptions import ConflictError
from core.mixins import ContractResponseMixin
from core.permissions import IsCompanyAdmin, IsTrainer
from core.responses import success_response
from utils.storage import generate_thumbnail, get_media_storage, get_upload_path

from .models import ClassMedia, ClassRecord, ClassTemplate, TrainingPlan
from .serializers import (
    BatchClassRecordSerializer,
    ClassMediaSerializer,
    ClassRecordCreateSerializer,
    ClassRecordSerializer,
    ClassTemplateSerializer,
    TrainingPlanCreateSerializer,
    TrainingPlanSerializer,
)
from .services import batch_create_class_records


def _tenant_queryset(queryset, user, requested_company=None):
    if user.role == UserRole.SUPER_ADMIN:
        if requested_company:
            queryset = queryset.filter(company_id=requested_company)
        return queryset
    return queryset.filter(company_id=user.company_id)


class ClassRecordPermission(BasePermission):
    """Company-level reads with trainer-owned writes."""

    def has_permission(self, request, view):
        role = getattr(request.user, 'role', None)
        if request.method in SAFE_METHODS:
            return role in IsTrainer.allowed_roles
        return role == UserRole.TRAINER

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        trainer_id = getattr(obj, 'trainer_id', None)
        if trainer_id is None and getattr(obj, 'class_record', None):
            trainer_id = obj.class_record.trainer_id
        return trainer_id == request.user.id


class ClassTemplatePermission(BasePermission):
    """Trainers can read templates; company administrators manage them."""

    def has_permission(self, request, view):
        role = getattr(request.user, 'role', None)
        if request.method in SAFE_METHODS:
            return role in IsTrainer.allowed_roles
        return role in IsCompanyAdmin.allowed_roles


class TrainingPlanPermission(BasePermission):
    """Trainers own plan writes; staff roles have tenant-scoped reads."""

    def has_permission(self, request, view):
        role = getattr(request.user, 'role', None)
        if request.method in SAFE_METHODS:
            return role in IsTrainer.allowed_roles
        return role == UserRole.TRAINER

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.trainer_id == request.user.id


class ClassRecordViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
    serializer_class = ClassRecordSerializer
    permission_classes = [ClassRecordPermission]
    queryset = ClassRecord.objects.select_related(
        'attendance',
        'schedule',
        'student',
        'trainer',
        'store',
        'plan',
    ).prefetch_related('media')

    def get_serializer_class(self):
        if self.action == 'create':
            return ClassRecordCreateSerializer
        return ClassRecordSerializer

    def get_queryset(self):
        queryset = _tenant_queryset(
            super().get_queryset(),
            self.request.user,
            self.request.query_params.get('company_id'),
        )
        student_id = (
            self.request.query_params.get('student_id')
            or self.request.query_params.get('student')
        )
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        trainer_id = (
            self.request.query_params.get('trainer_id')
            or self.request.query_params.get('trainer')
        )
        if trainer_id:
            queryset = queryset.filter(trainer_id=trainer_id)

        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        date_range = self.request.query_params.get('date_range')
        if date_range:
            parts = [
                part.strip()
                for part in date_range.replace('~', ',').split(',')
            ]
            if len(parts) != 2 or not all(parts):
                raise serializers.ValidationError(
                    {'date_range': ['格式必须为 start_date,end_date。']}
                )
            date_from, date_to = parts

        date_field = serializers.DateField()
        if date_from:
            queryset = queryset.filter(
                class_date__gte=date_field.run_validation(date_from)
            )
        if date_to:
            queryset = queryset.filter(
                class_date__lte=date_field.run_validation(date_to)
            )
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        record = serializer.save()
        output = ClassRecordSerializer(
            record,
            context=self.get_serializer_context(),
        )
        return success_response(data=output.data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        if serializer.instance.status == 'completed':
            raise ConflictError(
                code='CLASS_RECORD_EDIT_FORBIDDEN',
                message='已完成的课时记录不能修改。',
            )
        serializer.save()

    @action(detail=True, methods=['post'], url_path='complete')
    def draft_to_complete(self, request, *args, **kwargs):
        record = self.get_object()
        if record.status != 'draft':
            raise ConflictError(
                code='CLASS_RECORD_ALREADY_COMPLETED',
                message='课时记录已经完成。',
            )
        record.status = 'completed'
        record.save(update_fields=['status', 'updated_at'])
        return success_response(data=ClassRecordSerializer(record).data)

    @action(detail=True, methods=['post'])
    def unlink(self, request, *args, **kwargs):
        record = self.get_object()
        if record.plan_id is None:
            raise ConflictError(
                code='CLASS_RECORD_NOT_LINKED',
                message='课时记录未关联训练规划。',
            )
        record.plan = None
        record.save(update_fields=['plan', 'updated_at'])
        return success_response(
            data=ClassRecordSerializer(
                record,
                context=self.get_serializer_context(),
            ).data
        )


class ClassMediaViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    serializer_class = ClassMediaSerializer
    permission_classes = [ClassRecordPermission]
    queryset = ClassMedia.objects.select_related(
        'class_record',
        'class_record__trainer',
    )

    def _get_record(self):
        records = _tenant_queryset(
            ClassRecord.objects.select_related('trainer'),
            self.request.user,
            self.request.query_params.get('company_id'),
        )
        try:
            record = records.get(pk=self.kwargs['record_id'])
        except ClassRecord.DoesNotExist:
            raise NotFound('课时记录不存在。') from None
        if (
            self.request.method not in SAFE_METHODS
            and record.trainer_id != self.request.user.id
        ):
            raise PermissionDenied('训练师只能维护自己的课时媒体。')
        if (
            self.request.method not in SAFE_METHODS
            and record.status == 'completed'
        ):
            raise ConflictError(
                code='CLASS_RECORD_EDIT_FORBIDDEN',
                message='已完成的课时记录不能修改。',
            )
        return record

    def get_queryset(self):
        record = self._get_record()
        return super().get_queryset().filter(class_record=record).order_by(
            'sort_order', 'id'
        )

    def perform_create(self, serializer):
        serializer.save(class_record=self._get_record())


class ClassTemplateViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    serializer_class = ClassTemplateSerializer
    permission_classes = [ClassTemplatePermission]
    queryset = ClassTemplate.objects.select_related(
        'company',
        'trainer',
        'course_template',
    )

    def get_queryset(self):
        queryset = _tenant_queryset(
            super().get_queryset(),
            self.request.user,
            self.request.query_params.get('company_id'),
        )
        if self.request.user.role == UserRole.TRAINER:
            queryset = queryset.filter(
                Q(scope='company_shared')
                | Q(scope='personal', trainer=self.request.user)
            )
        scope = self.request.query_params.get('scope')
        if scope:
            allowed_scopes = {value for value, _ in ClassTemplate.SCOPE_CHOICES}
            if scope not in allowed_scopes:
                raise serializers.ValidationError(
                    {'scope': ['仅支持 personal 或 company_shared。']}
                )
            queryset = queryset.filter(scope=scope)
        return queryset.order_by('scope', 'name', 'id')

    def perform_create(self, serializer):
        trainer = serializer.validated_data['trainer']
        course_template = serializer.validated_data.get('course_template')
        company_id = self.request.user.company_id or trainer.company_id
        if company_id is None or trainer.company_id != company_id:
            raise serializers.ValidationError(
                {'trainer': ['训练师必须属于目标公司。']}
            )
        if (
            course_template is not None
            and course_template.company_id != company_id
        ):
            raise serializers.ValidationError(
                {'course_template': ['课程类型必须属于目标公司。']}
            )
        serializer.save(company_id=company_id)


class TrainingPlanViewSet(ContractResponseMixin, viewsets.ModelViewSet):
    http_method_names = [
        'get',
        'post',
        'patch',
        'delete',
        'head',
        'options',
    ]
    serializer_class = TrainingPlanSerializer
    permission_classes = [TrainingPlanPermission]
    queryset = TrainingPlan.objects.select_related(
        'company',
        'student',
        'student__user',
        'trainer',
    )

    def get_serializer_class(self):
        if self.action == 'create':
            return TrainingPlanCreateSerializer
        return TrainingPlanSerializer

    def get_queryset(self):
        queryset = _tenant_queryset(
            super().get_queryset(),
            self.request.user,
            self.request.query_params.get('company_id'),
        )
        if self.request.user.role == UserRole.TRAINER:
            queryset = queryset.filter(trainer=self.request.user)

        student_id = (
            self.request.query_params.get('student_id')
            or self.request.query_params.get('student')
        )
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        trainer_id = (
            self.request.query_params.get('trainer_id')
            or self.request.query_params.get('trainer')
        )
        if trainer_id:
            queryset = queryset.filter(trainer_id=trainer_id)
        status_value = self.request.query_params.get('status')
        if status_value:
            allowed = {value for value, _ in TrainingPlan.STATUS_CHOICES}
            if status_value not in allowed:
                raise serializers.ValidationError(
                    {'status': ['无效的训练规划状态。']}
                )
            queryset = queryset.filter(status=status_value)
        return queryset

    def perform_create(self, serializer):
        company_id = self.request.user.company_id
        if company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前训练师必须关联公司。']}
            )
        serializer.save(
            trainer=self.request.user,
            company_id=company_id,
        )

    @action(detail=True, methods=['post'])
    def complete(self, request, *args, **kwargs):
        plan = self.get_object()
        if plan.status == 'completed':
            raise ConflictError(
                code='TRAINING_PLAN_ALREADY_COMPLETED',
                message='训练规划已经完成。',
            )
        plan.status = 'completed'
        plan.save(update_fields=['status', 'updated_at'])
        return success_response(
            data=TrainingPlanSerializer(
                plan,
                context=self.get_serializer_context(),
            ).data
        )

    @action(detail=True, methods=['post'])
    def pause(self, request, *args, **kwargs):
        plan = self.get_object()
        if plan.status == 'completed':
            raise ConflictError(
                code='TRAINING_PLAN_COMPLETED',
                message='已完成的训练规划不能暂停。',
            )
        if plan.status == 'paused':
            raise ConflictError(
                code='TRAINING_PLAN_ALREADY_PAUSED',
                message='训练规划已经暂停。',
            )
        plan.status = 'paused'
        plan.save(update_fields=['status', 'updated_at'])
        return success_response(
            data=TrainingPlanSerializer(
                plan,
                context=self.get_serializer_context(),
            ).data
        )


class BatchClassRecordView(APIView):
    permission_classes = [ClassRecordPermission]

    def post(self, request):
        serializer = BatchClassRecordSerializer(
            data=request.data,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        records = batch_create_class_records(
            data['schedule_id'],
            data['common_data'],
            data['student_overrides'],
        )
        return success_response(
            data={
                'created_count': len(records),
                'items': ClassRecordSerializer(records, many=True).data,
            },
            status=status.HTTP_201_CREATED,
        )


class FileUploadView(APIView):
    permission_classes = [IsTrainer]
    parser_classes = [MultiPartParser, FormParser]
    max_file_size = 10 * 1024 * 1024
    allowed_media_types = {'image', 'video'}
    allowed_extensions = {
        'image': {'gif', 'jpeg', 'jpg', 'png', 'webp'},
        'video': {'avi', 'mkv', 'mov', 'mp4', 'webm'},
    }

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        if uploaded_file is None:
            raise serializers.ValidationError({'file': ['必须上传文件。']})
        if uploaded_file.size > self.max_file_size:
            raise serializers.ValidationError(
                {'file': ['文件大小不能超过 10MB。']}
            )

        content_type = (uploaded_file.content_type or '').lower()
        media_type = request.data.get('media_type', '').strip().lower()
        if not media_type and '/' in content_type:
            media_type = content_type.split('/', 1)[0]
        if media_type not in self.allowed_media_types:
            raise serializers.ValidationError(
                {'media_type': ['仅支持 image 或 video。']}
            )
        if content_type and not content_type.startswith(f'{media_type}/'):
            raise serializers.ValidationError(
                {'file': ['文件内容类型与 media_type 不匹配。']}
            )
        extension = Path(uploaded_file.name).suffix.lower().lstrip('.')
        if extension not in self.allowed_extensions[media_type]:
            raise serializers.ValidationError(
                {'file': ['文件扩展名与媒体类型不匹配或不受支持。']}
            )

        company_id = getattr(request.user, 'company_id', None)
        if company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前用户必须关联公司。']}
            )

        upload_target = SimpleNamespace(
            company_id=company_id,
            entity='class_media',
        )
        upload_path = get_upload_path(upload_target, uploaded_file.name)
        storage = get_media_storage()
        saved_name = storage.save(upload_path, uploaded_file)

        try:
            thumbnail_url = self._thumbnail_url(
                request,
                storage,
                saved_name,
                media_type,
            )
        except (OSError, UnidentifiedImageError, ValueError):
            storage.delete(saved_name)
            raise serializers.ValidationError(
                {'file': ['无法读取图片文件。']}
            ) from None

        file_url = request.build_absolute_uri(storage.url(saved_name))
        return success_response(
            data={
                'file_url': file_url,
                'thumbnail_url': thumbnail_url,
            },
            status=status.HTTP_201_CREATED,
        )

    @staticmethod
    def _thumbnail_url(request, storage: Storage, saved_name, media_type):
        if media_type != 'image':
            return ''
        try:
            image_path = storage.path(saved_name)
        except NotImplementedError:
            return ''
        relative_url = generate_thumbnail(image_path)
        return request.build_absolute_uri(relative_url)
