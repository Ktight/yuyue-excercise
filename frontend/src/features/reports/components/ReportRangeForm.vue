<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchStudents } from '@/features/students';
import type { Student } from '@/features/students';
import type { ReportRequest } from '../model';
const props = defineProps<{ onSubmit: (value: ReportRequest) => Promise<void> }>();
const students = ref<Student[]>([]),
  studentId = ref(0),
  preset = ref<'4w' | '8w' | 'custom'>('4w');
const start = ref(''),
  end = ref(new Date().toISOString().slice(0, 10)),
  error = ref('');
function applyPreset() {
  if (preset.value === 'custom') return;
  const d = new Date(`${end.value}T00:00:00`);
  d.setDate(d.getDate() - (preset.value === '4w' ? 28 : 56));
  start.value = d.toISOString().slice(0, 10);
}
async function submit() {
  applyPreset();
  const days =
    (new Date(`${end.value}T00:00:00`).getTime() - new Date(`${start.value}T00:00:00`).getTime()) /
      86_400_000 +
    1;
  if (!studentId.value || !start.value || start.value > end.value || days > 366) {
    error.value = '请选择学员，并确认日期有效且范围不超过 366 天';
    return;
  }
  error.value = '';
  await props.onSubmit({
    studentId: studentId.value,
    rangeStart: start.value,
    rangeEnd: end.value,
  });
}
onMounted(async () => {
  students.value = (await fetchStudents({ page: 1, pageSize: 100 })).items;
  studentId.value = students.value[0]?.user.id ?? 0;
  applyPreset();
});
</script>
<template>
  <form @submit.prevent="submit">
    <label
      >学员<select v-model.number="studentId">
        <option v-for="s in students" :key="s.id" :value="s.user.id">{{ s.user.name }}</option>
      </select></label
    ><label
      >范围<select v-model="preset" @change="applyPreset">
        <option value="4w">最近 4 周</option>
        <option value="8w">最近 8 周</option>
        <option value="custom">自定义</option>
      </select></label
    ><label>开始日期<input v-model="start" type="date" :disabled="preset !== 'custom'" /></label
    ><label>结束日期<input v-model="end" type="date" /></label>
    <p v-if="error" role="alert">{{ error }}</p>
    <button>生成预览</button>
  </form>
</template>
<style scoped>
form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}
label {
  display: grid;
  gap: var(--space-2);
}
select,
input {
  padding: var(--space-3);
}
button {
  align-self: end;
}
[role='alert'] {
  color: var(--color-danger);
}
</style>
