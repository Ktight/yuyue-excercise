from rest_framework import serializers

from core.constants import ReminderCategory, ReminderPriority


class DashboardMetricSerializer(serializers.Serializer):
    today_classes = serializers.IntegerField(min_value=0)
    today_bookings = serializers.IntegerField(min_value=0)
    active_students = serializers.IntegerField(min_value=0)
    pending_items = serializers.IntegerField(min_value=0)


class BookingTrendPointSerializer(serializers.Serializer):
    label = serializers.DateField()
    value = serializers.IntegerField(min_value=0)


class TodayScheduleSerializer(serializers.Serializer):
    id = serializers.IntegerField(min_value=1)
    time = serializers.TimeField(format='%H:%M')
    course_name = serializers.CharField()
    trainer_name = serializers.CharField()
    room_name = serializers.CharField()
    booked = serializers.IntegerField(min_value=0)
    capacity = serializers.IntegerField(min_value=1)


class AdminDashboardSerializer(serializers.Serializer):
    generated_at = serializers.DateTimeField()
    timezone = serializers.CharField()
    metrics = DashboardMetricSerializer()
    booking_trend = BookingTrendPointSerializer(many=True)
    today_schedules = TodayScheduleSerializer(many=True)


class ReminderQuerySerializer(serializers.Serializer):
    unread_only = serializers.BooleanField(default=False)


class ReminderSerializer(serializers.Serializer):
    id = serializers.IntegerField(min_value=1)
    title = serializers.CharField()
    message = serializers.CharField()
    category = serializers.ChoiceField(choices=ReminderCategory.CHOICES)
    priority = serializers.ChoiceField(choices=ReminderPriority.CHOICES)
    created_at = serializers.DateTimeField()
    is_read = serializers.BooleanField()
    is_dismissed = serializers.BooleanField()
    action_label = serializers.CharField(required=False)
    action_to = serializers.RegexField(
        r'^/admin/(schedules|attendance|students|training-plans|class-records)'
        r'(?:/\d+)?$',
        required=False,
    )
