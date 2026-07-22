<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchStudents, type Student } from '@/features/students';
const props = defineProps<{
  scheduleId: number;
  onSubmit: (studentUserId: number) => Promise<void>;
}>();
const students = ref<Student[]>([]),
  studentUserId = ref<number>(),
  saving = ref(false),
  error = ref('');
onMounted(async () => {
  try {
    students.value = (await fetchStudents({ pageSize: 100 })).items;
  } catch {
    error.value = '学员列表加载失败';
  }
});
async function submit() {
  if (!studentUserId.value) return;
  saving.value = true;
  error.value = '';
  try {
    await props.onSubmit(studentUserId.value);
    studentUserId.value = undefined;
  } catch {
    error.value = '预约失败，请检查资格、容量或时间冲突';
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <form class="form" @submit.prevent="submit">
    <label
      >代预约学员<select v-model="studentUserId" required>
        <option :value="undefined" disabled>请选择学员</option>
        <option v-for="student in students" :key="student.id" :value="student.user.id">
          {{ student.user.name }} · {{ student.user.phone }}
        </option>
      </select></label
    ><button :disabled="saving">{{ saving ? '预约中…' : '确认代预约' }}</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>
<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: end;
  margin: var(--space-4) 0;
}
label {
  display: grid;
  gap: var(--space-1);
}
select,
button {
  padding: var(--space-3);
  font: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
p {
  color: var(--color-danger);
}
</style>
