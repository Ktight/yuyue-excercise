<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchStudents } from '@/features/students';
import { fetchTrainingPlans, type TrainingPlan } from '@/features/training-plans';
const props = defineProps<{
  modelValue?: number | null;
  studentUserId?: number;
  disabled?: boolean;
}>();
const emit = defineEmits<{ 'update:modelValue': [number | null | undefined] }>();
const items = ref<TrainingPlan[]>([]),
  error = ref('');
watch(
  () => props.studentUserId,
  async (userId) => {
    items.value = [];
    error.value = '';
    if (!userId) return;
    try {
      const students = await fetchStudents({ pageSize: 100 });
      const profile = students.items.find((item) => item.user.id === userId);
      if (profile)
        items.value = (
          await fetchTrainingPlans({ studentId: profile.id, status: 'active', pageSize: 100 })
        ).items;
    } catch {
      error.value = '训练计划选项加载失败';
    }
  },
  { immediate: true },
);
function change(event: globalThis.Event) {
  const value = (event.target as globalThis.HTMLSelectElement).value;
  emit('update:modelValue', value === 'auto' ? undefined : value === 'none' ? null : Number(value));
}
</script>
<template>
  <label
    >训练计划<select
      :value="modelValue === undefined ? 'auto' : modelValue === null ? 'none' : String(modelValue)"
      :disabled="disabled || !studentUserId"
      @change="change"
    >
      <option value="auto">自动关联该学员的进行中计划</option>
      <option value="none">本次不关联计划</option>
      <option v-for="item in items" :key="item.id" :value="item.id">
        {{ item.title }} · {{ item.progressPercentage }}%
      </option></select
    ><small v-if="error" role="alert">{{ error }}</small></label
  >
</template>
<style scoped>
label {
  display: grid;
  gap: var(--space-1);
}
select {
  padding: var(--space-2) var(--space-3);
}
small {
  color: var(--color-danger);
}
</style>
