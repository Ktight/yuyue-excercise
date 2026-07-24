<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchCourseTemplates, type CourseTemplate } from '@/features/course-templates';
import { fetchUsers, type UserDto } from '@/features/users';

defineProps<{ trainerId: number; courseTemplateId: number | null; disabled?: boolean }>();
defineEmits<{
  'update:trainerId': [number];
  'update:courseTemplateId': [number | null];
}>();

const trainers = ref<UserDto[]>([]);
const templates = ref<CourseTemplate[]>([]);
const error = ref('');

onMounted(async () => {
  try {
    const [trainerResult, templateResult] = await Promise.all([
      fetchUsers({ page_size: 100, role: 'trainer', is_active: true }),
      fetchCourseTemplates({ pageSize: 100, status: 'active' }),
    ]);
    trainers.value = trainerResult.items;
    templates.value = templateResult.items;
  } catch {
    error.value = '教练或课程模板选项加载失败';
  }
});
</script>

<template>
  <label>
    教练
    <select
      :value="trainerId || ''"
      :disabled="disabled"
      required
      @change="$emit('update:trainerId', Number(($event.target as HTMLSelectElement).value))"
    >
      <option value="" disabled>请选择教练</option>
      <option v-for="item in trainers" :key="item.id" :value="item.id">
        {{ item.name }} · {{ item.phone }}
      </option>
    </select>
  </label>
  <label>
    关联课程模板（可选）
    <select
      :value="courseTemplateId ?? ''"
      :disabled="disabled"
      @change="
        $emit(
          'update:courseTemplateId',
          ($event.target as HTMLSelectElement).value
            ? Number(($event.target as HTMLSelectElement).value)
            : null,
        )
      "
    >
      <option value="">不关联课程模板</option>
      <option v-for="item in templates" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
  </label>
  <p v-if="error" class="resource-error" role="alert">{{ error }}</p>
</template>

<style scoped>
label {
  display: grid;
  gap: var(--space-2);
  font-size: var(--text-sm);
}
select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
}
.resource-error {
  color: var(--color-danger);
}
</style>
