<script setup lang="ts">
export type StudentDetailTab = 'info' | 'membership' | 'assessment';
defineProps<{ modelValue: StudentDetailTab }>();
defineEmits<{ 'update:modelValue': [StudentDetailTab] }>();
const tabs = [
  { value: 'info', label: '档案信息' },
  { value: 'membership', label: '会员资格' },
  { value: 'assessment', label: '身体评估' },
] as const;
</script>
<template>
  <nav class="tabs" aria-label="学员详情">
    <button
      v-for="item in tabs"
      :key="item.value"
      :class="{ active: modelValue === item.value }"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>
<style scoped>
.tabs {
  display: flex;
  margin-bottom: var(--space-6);
  border-bottom: 2px solid var(--color-border);
}
button {
  padding: var(--space-3) var(--space-4);
  background: none;
  border: 0;
  border-bottom: 2px solid transparent;
}
.active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
}
</style>
