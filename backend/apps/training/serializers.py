from rest_framework import serializers

from apps.attendance.models import Attendance
from apps.courses.models import CourseSchedule
from core.constants import UserRole

from .models import ClassMedia, ClassRecord, ClassTemplate, TrainingPlan
from .services import (
    calculate_plan_progress,
    create_class_record_from_attendance,
)


def validate_pose_sequence(value):
    sections = {'warmup', 'main', 'cooldown'}
    if not isinstance(value, dict) or set(value) != sections:
        raise serializers.ValidationError(
            '必须包含且仅包含 warmup、main、cooldown。'
        )
    allowed_fields = {'name', 'duration', 'notes', 'variations', 'assists'}
    for section in sections:
        poses = value[section]
        if not isinstance(poses, list):
            raise serializers.ValidationError(f'{section} 必须为数组。')
        for index, pose in enumerate(poses):
            if not isinstance(pose, dict):
                raise serializers.ValidationError(
                    f'{section}[{index}] 必须为 JSON 对象。'
                )
            if set(pose) - allowed_fields or not {'name', 'duration'} <= set(pose):
                raise serializers.ValidationError(
                    f'{section}[{index}] 字段不完整或包含未知字段。'
                )
            if not isinstance(pose['name'], str) or not pose['name'].strip():
                raise serializers.ValidationError(
                    f'{section}[{index}].name 必须为非空字符串。'
                )
            if type(pose['duration']) is not int or pose['duration'] < 1:
                raise serializers.ValidationError(
                    f'{section}[{index}].duration 必须为正整数。'
                )
            for field in ('notes', 'variations', 'assists'):
                if field in pose and not isinstance(pose[field], str):
                    raise serializers.ValidationError(
                        f'{section}[{index}].{field} 必须为字符串。'
                    )
    return value


def validate_string_list(value, field_name):
    if not isinstance(value, list) or any(
        not isinstance(item, str) for item in value
    ):
        raise serializers.ValidationError(
            f'{field_name} 必须为字符串数组。'
        )
    return value


class ClassMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassMedia
        fields = [
            'id',
            'class_record',
            'media_type',
            'file_url',
            'thumbnail_url',
            'caption',
            'annotations',
            'sort_order',
        ]
        read_only_fields = ['id', 'class_record']

    def validate_annotations(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError('必须为 JSON 对象或 null。')
        return value


class ClassRecordPlanSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()

    class Meta:
        model = TrainingPlan
        fields = ['id', 'title', 'progress']

    def get_progress(self, instance):
        cache = self.context.setdefault('_plan_progress_cache', {})
        if instance.pk not in cache:
            cache[instance.pk] = calculate_plan_progress(instance)
        return cache[instance.pk]['percentage']


class ClassRecordSerializer(serializers.ModelSerializer):
    media = ClassMediaSerializer(many=True, read_only=True)
    plan = ClassRecordPlanSerializer(read_only=True)
    attendance_status = serializers.CharField(
        source='attendance.status',
        read_only=True,
        allow_null=True,
    )
    student_name = serializers.CharField(source='student.name', read_only=True)
    trainer_name = serializers.CharField(source='trainer.name', read_only=True)

    class Meta:
        model = ClassRecord
        fields = [
            'id',
            'company',
            'attendance',
            'attendance_status',
            'schedule',
            'student',
            'student_name',
            'trainer',
            'trainer_name',
            'store',
            'plan',
            'class_date',
            'theme',
            'session_number',
            'pose_sequence',
            'trainer_notes',
            'homework',
            'completion_rating',
            'improvement_tags',
            'next_focus',
            'status',
            'media',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'company',
            'attendance',
            'schedule',
            'student',
            'trainer',
            'store',
            'class_date',
            'session_number',
            'status',
            'created_at',
            'updated_at',
        ]

    def validate_pose_sequence(self, value):
        return validate_pose_sequence(value)

    def validate_improvement_tags(self, value):
        return validate_string_list(value, 'improvement_tags')


class ClassRecordCreateSerializer(serializers.ModelSerializer):
    attendance_id = serializers.IntegerField(min_value=1, write_only=True)

    class Meta:
        model = ClassRecord
        fields = [
            'attendance_id',
            'plan',
            'theme',
            'pose_sequence',
            'trainer_notes',
            'homework',
            'completion_rating',
            'improvement_tags',
            'next_focus',
        ]

    def validate(self, attrs):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        attendance_id = attrs['attendance_id']
        try:
            attendance = Attendance.objects.select_related('schedule').get(
                pk=attendance_id
            )
        except Attendance.DoesNotExist:
            raise serializers.ValidationError(
                {'attendance_id': ['签到记录不存在。']}
            ) from None

        if user is not None and user.role != UserRole.SUPER_ADMIN:
            if attendance.company_id != user.company_id:
                raise serializers.ValidationError(
                    {'attendance_id': ['签到记录不属于当前公司。']}
                )
        if user is not None and user.role == UserRole.TRAINER:
            if attendance.schedule.trainer_id != user.id:
                raise serializers.ValidationError(
                    {'attendance_id': ['训练师只能记录自己授课的课程。']}
                )
        return attrs

    def validate_pose_sequence(self, value):
        return validate_pose_sequence(value)

    def validate_improvement_tags(self, value):
        return validate_string_list(value, 'improvement_tags')

    def create(self, validated_data):
        attendance_id = validated_data.pop('attendance_id')
        return create_class_record_from_attendance(attendance_id, validated_data)


class BatchClassRecordSerializer(serializers.Serializer):
    schedule_id = serializers.IntegerField(min_value=1)
    common_data = serializers.JSONField()
    student_overrides = serializers.JSONField()

    common_fields = {'theme', 'pose_sequence', 'trainer_notes', 'homework'}
    required_common_fields = {'theme', 'pose_sequence'}
    override_fields = {
        'completion_rating',
        'trainer_notes',
        'improvement_tags',
        'homework',
    }

    def validate_schedule_id(self, value):
        try:
            schedule = CourseSchedule.objects.get(pk=value)
        except CourseSchedule.DoesNotExist:
            raise serializers.ValidationError('排课不存在。') from None

        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user is not None and (
            schedule.company_id != user.company_id
            or schedule.trainer_id != user.id
        ):
            raise serializers.ValidationError('训练师只能批量记录自己的排课。')
        return value

    def validate_common_data(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError('必须为 JSON 对象。')
        unknown_fields = set(value) - self.common_fields
        if unknown_fields:
            raise serializers.ValidationError(
                f'不支持字段：{sorted(unknown_fields)}'
            )
        missing_fields = self.required_common_fields - set(value)
        if missing_fields:
            raise serializers.ValidationError(
                f'缺少字段：{sorted(missing_fields)}'
            )
        if not isinstance(value['theme'], str) or not value['theme'].strip():
            raise serializers.ValidationError('theme 必须为非空字符串。')
        try:
            validate_pose_sequence(value['pose_sequence'])
        except serializers.ValidationError as exc:
            raise serializers.ValidationError(
                {'pose_sequence': exc.detail}
            ) from None
        for field in ('trainer_notes', 'homework'):
            if field in value and not isinstance(value[field], str):
                raise serializers.ValidationError(f'{field} 必须为字符串。')
        return value

    def validate_student_overrides(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError('必须为 JSON 对象。')

        normalized = {}
        for raw_student_id, override in value.items():
            try:
                student_id = int(raw_student_id)
            except (TypeError, ValueError):
                raise serializers.ValidationError(
                    f'无效学员 ID：{raw_student_id}'
                ) from None
            if student_id < 1 or isinstance(raw_student_id, bool):
                raise serializers.ValidationError(
                    f'无效学员 ID：{raw_student_id}'
                )
            if not isinstance(override, dict):
                raise serializers.ValidationError(
                    f'学员 {student_id} 的覆盖内容必须为 JSON 对象。'
                )
            unknown_fields = set(override) - self.override_fields
            if unknown_fields:
                raise serializers.ValidationError(
                    f'学员 {student_id} 不支持字段：{sorted(unknown_fields)}'
                )

            rating = override.get('completion_rating')
            if rating is not None and (
                type(rating) is not int or rating < 1 or rating > 5
            ):
                raise serializers.ValidationError(
                    f'学员 {student_id} 的 completion_rating 必须为 1-5。'
                )
            tags = override.get('improvement_tags')
            if tags is not None and (
                not isinstance(tags, list)
                or any(not isinstance(tag, str) for tag in tags)
            ):
                raise serializers.ValidationError(
                    f'学员 {student_id} 的 improvement_tags 必须为字符串数组。'
                )
            for field in ('trainer_notes', 'homework'):
                if field in override and not isinstance(override[field], str):
                    raise serializers.ValidationError(
                        f'学员 {student_id} 的 {field} 必须为字符串。'
                    )
            normalized[student_id] = override
        return normalized


class ClassTemplateSerializer(serializers.ModelSerializer):
    trainer_name = serializers.CharField(source='trainer.name', read_only=True)
    course_template_name = serializers.CharField(
        source='course_template.name',
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = ClassTemplate
        fields = [
            'id',
            'company',
            'trainer',
            'trainer_name',
            'name',
            'scope',
            'course_template',
            'course_template_name',
            'pose_sequence',
            'notes_template',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'company', 'created_at', 'updated_at']

    def validate(self, attrs):
        instance = self.instance
        company_id = getattr(instance, 'company_id', None)
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if company_id is None and user is not None:
            company_id = user.company_id

        trainer = attrs.get('trainer', getattr(instance, 'trainer', None))
        course_template = attrs.get(
            'course_template',
            getattr(instance, 'course_template', None),
        )
        related_objects = [obj for obj in (trainer, course_template) if obj]
        if company_id and any(
            getattr(obj, 'company_id', None) != company_id
            for obj in related_objects
        ):
            raise serializers.ValidationError(
                {'company': ['训练师和课程类型必须属于模板所在公司。']}
            )
        return attrs

    def validate_pose_sequence(self, value):
        return validate_pose_sequence(value)


class TrainingPlanSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='student.user.name',
        read_only=True,
    )
    trainer_name = serializers.CharField(source='trainer.name', read_only=True)
    completed_sessions_count = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()
    linked_records = serializers.SerializerMethodField()

    class Meta:
        model = TrainingPlan
        fields = [
            'id',
            'company',
            'student',
            'student_name',
            'trainer',
            'trainer_name',
            'title',
            'start_date',
            'end_date',
            'target_frequency_per_week',
            'goal_description',
            'focus_tags',
            'status',
            'completed_sessions_count',
            'progress_percentage',
            'linked_records',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'company',
            'trainer',
            'completed_sessions_count',
            'progress_percentage',
            'linked_records',
            'created_at',
            'updated_at',
        ]

    def _progress(self, instance):
        cache = getattr(self, '_progress_cache', None)
        if cache is None:
            cache = self._progress_cache = {}
        if instance.pk not in cache:
            cache[instance.pk] = calculate_plan_progress(instance)
        return cache[instance.pk]

    def get_completed_sessions_count(self, instance):
        return self._progress(instance)['completed']

    def get_progress_percentage(self, instance):
        return self._progress(instance)['percentage']

    def get_fields(self):
        fields = super().get_fields()
        view = self.context.get('view')
        if getattr(view, 'action', None) != 'retrieve':
            fields.pop('linked_records', None)
        return fields

    def get_linked_records(self, instance):
        request = self.context.get('request')
        query_params = getattr(request, 'query_params', {})
        page = self._positive_page_value(
            query_params.get('linked_records_page', query_params.get('page', 1)),
            'linked_records_page',
        )
        page_size = self._positive_page_value(
            query_params.get(
                'linked_records_page_size',
                query_params.get('page_size', 20),
            ),
            'linked_records_page_size',
        )
        if page_size > 100:
            raise serializers.ValidationError(
                {'linked_records_page_size': ['不得大于 100。']}
            )

        records = instance.class_records.select_related(
            'attendance',
            'schedule',
            'student',
            'trainer',
            'store',
            'plan',
        ).prefetch_related('media')
        total = records.count()
        offset = (page - 1) * page_size
        items = records[offset:offset + page_size]
        return {
            'items': ClassRecordSerializer(
                items,
                many=True,
                context=self.context,
            ).data,
            'page': page,
            'page_size': page_size,
            'total': total,
        }

    @staticmethod
    def _positive_page_value(value, field_name):
        try:
            parsed = int(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError(
                {field_name: ['必须为整数。']}
            ) from None
        if parsed < 1:
            raise serializers.ValidationError(
                {field_name: ['必须大于或等于 1。']}
            )
        return parsed

    def validate_focus_tags(self, value):
        return validate_string_list(value, 'focus_tags')

    def validate(self, attrs):
        attrs = super().validate(attrs)
        instance = self.instance
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        student = attrs.get('student', getattr(instance, 'student', None))
        start_date = attrs.get(
            'start_date',
            getattr(instance, 'start_date', None),
        )
        end_date = attrs.get('end_date', getattr(instance, 'end_date', None))
        status_value = attrs.get('status', getattr(instance, 'status', None))

        if user is not None and student is not None:
            if student.company_id != user.company_id:
                raise serializers.ValidationError(
                    {'student': ['学员必须属于当前公司。']}
                )
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError(
                {'end_date': ['结束日期不能早于开始日期。']}
            )
        if student is not None and status_value == 'active':
            active_plans = TrainingPlan.objects.filter(
                student=student,
                status='active',
            )
            if instance is not None:
                active_plans = active_plans.exclude(pk=instance.pk)
            if active_plans.exists():
                raise serializers.ValidationError(
                    {'status': ['该学员已有进行中的训练规划。']}
                )
        return attrs


class TrainingPlanCreateSerializer(TrainingPlanSerializer):
    def validate(self, attrs):
        return super().validate(attrs)
