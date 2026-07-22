<script setup lang="ts">
export type StudentDetailTab = 'info' | 'assessment' | 'records' | 'plans';

defineProps<{ modelValue: StudentDetailTab }>();
defineEmits<{ 'update:modelValue': [tab: StudentDetailTab] }>();

const tabs: ReadonlyArray<{ value: StudentDetailTab; label: string }> = [
  { value: 'info', label: '档案信息' },
  { value: 'assessment', label: '身体评估' },
  { value: 'records', label: '课时记录' },
  { value: 'plans', label: '训练规划' },
];
</script>

<template>
  <nav class="student-detail-tabs" aria-label="学员详情">
    <button
      v-for="item in tabs"
      :key="item.value"
      type="button"
      :class="{ active: modelValue === item.value }"
      :aria-current="modelValue === item.value ? 'page' : undefined"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<style scoped>
.student-detail-tabs {
  display: flex;
  gap: 0;
  margin-bottom: var(--space-6);
  overflow-x: auto;
  border-bottom: 2px solid var(--color-border);
}

.student-detail-tabs button {
  flex: 0 0 auto;
  padding: var(--space-2) var(--space-4);
  margin-bottom: -2px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  white-space: nowrap;
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.student-detail-tabs button.active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
}
</style>
