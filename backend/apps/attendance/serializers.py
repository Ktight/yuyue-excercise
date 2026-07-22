from rest_framework import serializers

from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    schedule_name = serializers.SerializerMethodField()
    checked_by_name = serializers.CharField(
        source='checked_by.name',
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Attendance
        fields = [
            'id',
            'company',
            'booking',
            'schedule',
            'student',
            'student_name',
            'schedule_name',
            'check_in_time',
            'status',
            'checked_by',
            'checked_by_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

    @staticmethod
    def get_schedule_name(instance):
        return str(instance.schedule)
