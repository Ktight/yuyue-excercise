<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchCourseTemplates } from '../api';
import type { CourseTemplate } from '../model';

const props = withDefaults(
  defineProps<{
    modelValue: number | null;
    companyId?: number;
    disabled?: boolean;
    includeInactive?: boolean;
  }>(),
  { companyId: undefined, disabled: false, includeInactive: false },
);
const emit = defineEmits<{ 'update:modelValue': [number | null] }>();
const options = ref<CourseTemplate[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const result = await fetchCourseTemplates({
      page: 1,
      pageSize: 100,
      companyId: props.companyId,
      status: props.includeInactive ? undefined : 'active',
    });
    options.value = result.items;
  } catch {
    error.value = '课程模板加载失败';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <select
    :value="modelValue ?? ''"
    :disabled="disabled || loading"
    @change="
      emit(
        'update:modelValue',
        ($event.target as HTMLSelectElement).value
          ? Number(($event.target as HTMLSelectElement).value)
          : null,
      )
    "
  >
    <option value="">{{ loading ? '加载中…' : '请选择课程模板' }}</option>
    <option v-for="item in options" :key="item.id" :value="item.id">
      {{ item.name }} · {{ item.durationMinutes }} 分钟
    </option>
  </select>
  <small v-if="error" role="alert">{{ error }}</small>
</template>
