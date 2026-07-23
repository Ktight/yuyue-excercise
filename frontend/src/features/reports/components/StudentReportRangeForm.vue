<script setup lang="ts">
import { ref } from 'vue';
import type { ReportRequest } from '../model';
const props = defineProps<{
  studentId: number;
  onSubmit: (value: ReportRequest) => Promise<void>;
}>();
const end = ref(new Date().toISOString().slice(0, 10)),
  date = new Date(`${end.value}T00:00:00`);
date.setDate(date.getDate() - 28);
const start = ref(date.toISOString().slice(0, 10)),
  error = ref('');
async function submit() {
  const days =
    (new Date(`${end.value}T00:00:00`).getTime() - new Date(`${start.value}T00:00:00`).getTime()) /
      86_400_000 +
    1;
  if (!props.studentId || !start.value || start.value > end.value || days > 366) {
    error.value = '请确认日期有效且范围不超过 366 天';
    return;
  }
  error.value = '';
  await props.onSubmit({
    studentId: props.studentId,
    rangeStart: start.value,
    rangeEnd: end.value,
  });
}
</script>
<template>
  <form @submit.prevent="submit">
    <label>开始日期<input v-model="start" type="date" /></label
    ><label>结束日期<input v-model="end" type="date" /></label>
    <p v-if="error" role="alert">{{ error }}</p>
    <button>生成我的报告</button>
  </form>
</template>
<style scoped>
form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-4);
}
label {
  display: grid;
  gap: var(--space-2);
}
input,
button {
  padding: var(--space-3);
}
button {
  align-self: end;
}
[role='alert'] {
  color: var(--color-danger);
}
</style>
