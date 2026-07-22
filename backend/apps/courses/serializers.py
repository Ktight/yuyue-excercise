from rest_framework import serializers

from core.constants import CourseCategory

from .models import CourseBooking, CourseSchedule, CourseTemplate


class CourseTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTemplate
        fields = '__all__'
        read_only_fields = ['company', 'cover_image']

    def validate(self, attrs):
        instance = self.instance
        category = attrs.get('category', getattr(instance, 'category', None))
        capacity = attrs.get(
            'max_capacity',
            getattr(instance, 'max_capacity', 1),
        )
        if category == CourseCategory.PRIVATE and capacity != 1:
            raise serializers.ValidationError(
                {'max_capacity': ['私教课最大容量必须为 1。']}
            )

        request = self.context.get('request')
        company_id = getattr(getattr(request, 'user', None), 'company_id', None)
        name = attrs.get('name', getattr(instance, 'name', None))
        if company_id and name:
            queryset = CourseTemplate.objects.filter(
                company_id=company_id,
                name=name,
            )
            if instance is not None:
                queryset = queryset.exclude(pk=instance.pk)
            if queryset.exists():
                raise serializers.ValidationError(
                    {'name': ['同一公司内的课程模板名称不能重复。']}
                )
        return attrs


class CourseScheduleSerializer(serializers.ModelSerializer):
    bookings_count = serializers.IntegerField(read_only=True, default=0)
    course_template_name = serializers.CharField(
        source='course_template.name',
        read_only=True,
    )
    trainer_name = serializers.CharField(source='trainer.name', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)

    class Meta:
        model = CourseSchedule
        fields = '__all__'
        read_only_fields = ['company']


class CourseScheduleCreateSerializer(serializers.ModelSerializer):
    end_date = serializers.DateField(write_only=True, required=False)

    class Meta:
        model = CourseSchedule
        validators = []
        fields = [
            'store',
            'room',
            'course_template',
            'trainer',
            'course_date',
            'start_time',
            'end_time',
            'capacity',
            'booking_deadline',
            'schedule_mode',
            'recurring_rule',
            'end_date',
            'status',
        ]

    def validate(self, attrs):
        if attrs['start_time'] >= attrs['end_time']:
            raise serializers.ValidationError(
                {'end_time': ['结束时间必须晚于开始时间。']}
            )

        request = self.context.get('request')
        company_id = getattr(getattr(request, 'user', None), 'company_id', None)
        related_objects = (
            attrs['store'],
            attrs['room'].store,
            attrs['course_template'],
            attrs['trainer'],
        )
        if company_id and any(
            getattr(obj, 'company_id', None) != company_id
            for obj in related_objects
        ):
            raise serializers.ValidationError(
                {'company': ['排课关联资源必须属于当前公司。']}
            )
        if attrs['room'].store_id != attrs['store'].id:
            raise serializers.ValidationError(
                {'room': ['教室必须属于所选门店。']}
            )

        if attrs.get('schedule_mode') == 'recurring':
            rule = attrs.get('recurring_rule')
            if not isinstance(rule, dict):
                raise serializers.ValidationError(
                    {'recurring_rule': ['周期排课必须提供重复规则。']}
                )
            weekdays = rule.get('weekdays')
            weeks = rule.get('weeks')
            if (
                not isinstance(weekdays, list)
                or not weekdays
                or any(type(day) is not int or day < 1 or day > 7 for day in weekdays)
            ):
                raise serializers.ValidationError(
                    {'recurring_rule': ['weekdays 必须是 1 至 7 的非空整数列表。']}
                )
            if type(weeks) is not int or weeks < 1 or weeks > 52:
                raise serializers.ValidationError(
                    {'recurring_rule': ['weeks 必须是 1 至 52 的整数。']}
                )
            end_date = attrs.get('end_date')
            if end_date is not None and end_date < attrs['course_date']:
                raise serializers.ValidationError(
                    {'end_date': ['截止日期不能早于起始日期。']}
                )
        elif attrs.get('recurring_rule') is not None or attrs.get('end_date') is not None:
            raise serializers.ValidationError(
                {'recurring_rule': ['单次排课不能提供周期规则。']}
            )

        return attrs


class BookingScheduleBriefSerializer(serializers.ModelSerializer):
    course_template_name = serializers.CharField(source='course_template.name')
    trainer_name = serializers.CharField(source='trainer.name')
    room_name = serializers.CharField(source='room.name')

    class Meta:
        model = CourseSchedule
        fields = [
            'id',
            'course_template_name',
            'trainer_name',
            'room_name',
            'course_date',
            'start_time',
            'end_time',
            'status',
        ]
        read_only_fields = fields


class BookingStudentBriefSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)
    phone = serializers.CharField(read_only=True)


class BookingSerializer(serializers.ModelSerializer):
    schedule = BookingScheduleBriefSerializer(read_only=True)
    student = BookingStudentBriefSerializer(read_only=True)
    schedule_id = serializers.IntegerField(write_only=True, required=False)
    student_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = CourseBooking
        fields = [
            'id',
            'company',
            'schedule',
            'schedule_id',
            'student',
            'student_id',
            'booking_time',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'company',
            'schedule',
            'student',
            'booking_time',
            'status',
            'created_at',
            'updated_at',
        ]
