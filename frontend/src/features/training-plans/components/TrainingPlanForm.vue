<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useUnsavedChangesGuard } from '@/app/composables';
import { fetchStudents } from '@/features/students';
import type { Student } from '@/features/students';
import { getErrorMessage } from '@/shared/api';
import type { TrainingPlan, TrainingPlanWriteInput } from '../model';
const p = defineProps<{
  initial?: TrainingPlan;
  readonly?: boolean;
  onSubmit: (value: TrainingPlanWriteInput) => Promise<unknown>;
}>();
const students = ref<Student[]>([]),
  tags = ref((p.initial?.focusTags ?? []).join('、')),
  busy = ref(false),
  error = ref('');
const form = reactive<TrainingPlanWriteInput>({
  studentId: p.initial?.studentId ?? 0,
  title: p.initial?.title ?? '',
  startDate: p.initial?.startDate ?? '',
  endDate: p.initial?.endDate ?? '',
  targetFrequencyPerWeek: p.initial?.targetFrequencyPerWeek ?? 2,
  goalDescription: p.initial?.goalDescription ?? '',
  focusTags: p.initial?.focusTags ?? [],
  status: p.initial?.status ?? 'active',
});
const { runGuardedSubmit } = useUnsavedChangesGuard({
  source: () => ({ form, tags: tags.value }),
  enabled: () => !p.readonly,
});
onMounted(async () => {
  if (p.readonly) return;
  try {
    students.value = (await fetchStudents({ pageSize: 100 })).items;
  } catch {
    error.value = '学员选项加载失败';
  }
});
async function submit() {
  if (form.endDate < form.startDate) {
    error.value = '结束日期不能早于开始日期';
    return;
  }
  busy.value = true;
  error.value = '';
  try {
    await runGuardedSubmit(() =>
      p.onSubmit({
        ...form,
        focusTags: tags.value
          .split(/[、,，]/)
          .map((x) => x.trim())
          .filter(Boolean),
      }),
    );
  } catch (cause) {
    error.value = getErrorMessage(cause, '训练计划保存失败');
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <label
      >学员<select
        v-model.number="form.studentId"
        required
        :disabled="readonly || Boolean(initial)"
      >
        <option :value="0" disabled>请选择学员</option>
        <option v-for="student in students" :key="student.id" :value="student.id">
          {{ student.user.name }}
        </option>
        <option v-if="initial" :value="initial.studentId">{{ initial.studentName }}</option>
      </select></label
    >
    <label
      >计划名称<input v-model.trim="form.title" required maxlength="200" :disabled="readonly"
    /></label>
    <div class="grid">
      <label
        >开始日期<input v-model="form.startDate" type="date" required :disabled="readonly"
      /></label>
      <label
        >结束日期<input v-model="form.endDate" type="date" required :disabled="readonly"
      /></label>
      <label
        >每周目标次数<input
          v-model.number="form.targetFrequencyPerWeek"
          type="number"
          min="1"
          max="14"
          required
          :disabled="readonly"
      /></label>
      <label
        >状态<select v-model="form.status" :disabled="readonly">
          <option value="active">进行中</option>
          <option value="paused">已暂停</option>
          <option value="completed">已完成</option>
        </select></label
      >
    </div>
    <label
      >训练目标<textarea v-model="form.goalDescription" rows="4" required :disabled="readonly" />
    </label>
    <label>重点标签<input v-model="tags" placeholder="用逗号分隔" :disabled="readonly" /></label>
    <button v-if="!readonly" :disabled="busy">{{ busy ? '保存中…' : '保存训练计划' }}</button>
  </form>
</template>
<style scoped>
form,
label {
  display: grid;
  gap: var(--space-3);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
input,
select,
textarea,
button {
  padding: var(--space-3);
  font: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
button {
  justify-self: start;
  color: white;
  background: var(--color-brand);
}
.error {
  color: var(--color-danger);
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
