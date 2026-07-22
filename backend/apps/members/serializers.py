from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.accounts.models import User
from core.constants import UserRole

from .models import BodyAssessment, StudentProfile
from .services import get_membership_status, validate_member_card


class StudentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'phone', 'avatar', 'is_active']
        read_only_fields = fields


class StudentAccountCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,
        min_length=8,
    )

    class Meta:
        model = User
        fields = ['name', 'phone', 'avatar', 'password']
        extra_kwargs = {'avatar': {'required': False, 'allow_null': True}}


class BodyAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyAssessment
        fields = '__all__'
        read_only_fields = ['student', 'photos', 'created_at']

    def validate_assess_date(self, value):
        if value > timezone.localdate():
            raise serializers.ValidationError('Assessment date cannot be in the future.')
        return value

    def validate_height(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError('Height must be greater than zero.')
        return value

    def validate_weight(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError('Weight must be greater than zero.')
        return value


class MembershipSerializer(serializers.Serializer):
    card_type = serializers.CharField()
    status = serializers.CharField()
    starts_on = serializers.DateField()
    expires_on = serializers.DateField()
    remaining_count = serializers.IntegerField(allow_null=True)
    balance_minor = serializers.IntegerField(allow_null=True)
    active = serializers.BooleanField()

    @classmethod
    def from_profile(cls, profile):
        card_type = profile.member_card_type
        return {
            'card_type': card_type,
            'status': get_membership_status(profile)[0],
            'starts_on': profile.member_card_start,
            'expires_on': profile.member_card_expire,
            'remaining_count': (
                profile.member_card_balance if card_type == 'count' else None
            ),
            'balance_minor': (
                profile.member_card_balance if card_type == 'stored' else None
            ),
            'active': profile.member_card_active,
        }


class MembershipUpdateSerializer(serializers.Serializer):
    card_type = serializers.ChoiceField(
        choices=['count', 'month', 'quarter', 'year', 'stored'],
        required=False,
    )
    starts_on = serializers.DateField(required=False)
    expires_on = serializers.DateField(required=False)
    remaining_count = serializers.IntegerField(min_value=0, required=False)
    balance_minor = serializers.IntegerField(min_value=0, required=False)
    active = serializers.BooleanField(required=False)

    def validate(self, attrs):
        profile = self.context['profile']
        card_type = attrs.get('card_type', profile.member_card_type)
        starts_on = attrs.get('starts_on', profile.member_card_start)
        expires_on = attrs.get('expires_on', profile.member_card_expire)
        if starts_on > expires_on:
            raise serializers.ValidationError(
                {'expires_on': ['会员卡到期日不能早于生效日。']}
            )
        if card_type == 'count' and 'balance_minor' in attrs:
            raise serializers.ValidationError(
                {'balance_minor': ['次卡不允许设置储值余额。']}
            )
        if card_type == 'stored' and 'remaining_count' in attrs:
            raise serializers.ValidationError(
                {'remaining_count': ['储值卡不允许设置剩余次数。']}
            )
        return attrs


class StudentProfileSerializer(serializers.ModelSerializer):
    user = StudentUserSerializer(read_only=True)
    recent_assessment = serializers.SerializerMethodField()
    member_card_status = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = '__all__'
        read_only_fields = [
            'user', 'company', 'created_at', 'updated_at',
            'member_card_type', 'member_card_start', 'member_card_expire',
            'member_card_balance', 'member_card_active',
        ]

    def validate(self, attrs):
        request = self.context.get('request')
        if request is None:
            return attrs
        request_user = request.user
        home_store = attrs.get('home_store', self.instance.home_store)
        primary_trainer = attrs.get(
            'primary_trainer', self.instance.primary_trainer
        )
        if request_user.role not in {
            UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN
        } and ({'home_store', 'primary_trainer'} & set(attrs)):
            raise serializers.ValidationError({
                'non_field_errors': [
                    'Only company administrators can transfer a student or reassign a trainer.'
                ]
            })
        if home_store.company_id != self.instance.company_id:
            raise serializers.ValidationError(
                {'home_store': ['Store does not belong to the student company.']}
            )
        if primary_trainer is not None and (
            primary_trainer.company_id != self.instance.company_id
            or primary_trainer.role != UserRole.TRAINER
        ):
            raise serializers.ValidationError(
                {'primary_trainer': ['Trainer must belong to the student company.']}
            )
        return attrs

    def get_recent_assessment(self, instance):
        assessment = instance.assessments.first()
        if assessment is None:
            return None
        return BodyAssessmentSerializer(assessment).data

    def get_member_card_status(self, instance):
        is_valid, reason = validate_member_card(instance)
        return {
            'status': get_membership_status(instance)[0],
            'is_valid': is_valid,
            'reason': reason,
        }

    def get_status(self, instance):
        return 'active' if instance.user.is_active else 'inactive'


class StudentProfileCreateSerializer(serializers.ModelSerializer):
    user = StudentAccountCreateSerializer()

    class Meta:
        model = StudentProfile
        exclude = ['company', 'created_at', 'updated_at']

    def validate(self, attrs):
        request_user = self.context['request'].user
        company_id = request_user.company_id
        home_store = attrs['home_store']
        primary_trainer = attrs.get('primary_trainer')

        if company_id is None:
            raise serializers.ValidationError(
                {'company': ['当前操作者未关联公司。']}
            )
        if home_store.company_id != company_id:
            raise serializers.ValidationError(
                {'home_store': ['归属门店不属于当前公司。']}
            )
        if request_user.role == UserRole.TRAINER and primary_trainer is None:
            primary_trainer = request_user
            attrs['primary_trainer'] = request_user
        if primary_trainer is not None:
            if primary_trainer.company_id != company_id:
                raise serializers.ValidationError(
                    {'primary_trainer': ['主教练不属于当前公司。']}
                )
            if primary_trainer.role != UserRole.TRAINER:
                raise serializers.ValidationError(
                    {'primary_trainer': ['主教练必须为教练角色。']}
                )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password', None)
        request_user = self.context['request'].user
        home_store = validated_data['home_store']
        student_user = User.objects.create_user(
            password=password,
            role=UserRole.STUDENT,
            company_id=request_user.company_id,
            store=home_store,
            **user_data,
        )
        return StudentProfile.objects.create(
            user=student_user,
            company_id=request_user.company_id,
            **validated_data,
        )

    def to_representation(self, instance):
        return StudentProfileSerializer(instance, context=self.context).data
