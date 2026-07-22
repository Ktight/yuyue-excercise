from rest_framework import serializers

from core.constants import CourseCategory

from .models import CourseTemplate


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
