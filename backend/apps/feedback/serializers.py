from rest_framework import serializers

from apps.accounts.models import User
from core.constants import FeedbackFeeling

from .models import StudentFeedback


class FeedbackStudentSummarySerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'avatar']
        read_only_fields = fields

    @staticmethod
    def get_avatar(instance):
        return instance.avatar or None


class StudentFeedbackSerializer(serializers.ModelSerializer):
    student = FeedbackStudentSummarySerializer(read_only=True)
    class_record_summary = serializers.SerializerMethodField()
    photos = serializers.SerializerMethodField()
    is_editable = serializers.BooleanField(default=False, read_only=True)

    class Meta:
        model = StudentFeedback
        fields = [
            'id',
            'company',
            'class_record',
            'class_record_summary',
            'student',
            'feeling',
            'improvement_note',
            'comment',
            'photos',
            'is_editable',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

    @staticmethod
    def get_class_record_summary(instance):
        record = instance.class_record
        return {
            'id': record.id,
            'class_date': record.class_date.isoformat(),
            'theme': record.theme,
            'trainer': {
                'id': record.trainer_id,
                'name': record.trainer.name,
            },
        }

    @staticmethod
    def get_photos(instance):
        # Phase 10 defers feedback media. Values inserted outside the public API
        # must not leak through the frozen response contract.
        return []


class StudentFeedbackCreateSerializer(serializers.Serializer):
    class_record = serializers.IntegerField(min_value=1)
    feeling = serializers.ChoiceField(choices=FeedbackFeeling.CHOICES)
    improvement_note = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=1000,
        default='',
    )
    comment = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=2000,
        default='',
    )

    def validate(self, attrs):
        attrs = super().validate(attrs)
        unknown_fields = set(self.initial_data) - set(self.fields)
        if unknown_fields:
            raise serializers.ValidationError(
                {
                    'non_field_errors': [
                        f'不支持字段：{sorted(unknown_fields)}'
                    ]
                }
            )
        return attrs
