<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { BodyAssessment, BodyAssessmentWriteInput } from '@/features/body-assessments/model';
const props = defineProps<{
  studentId: number;
  initial?: BodyAssessment | null;
  onSubmit: (value: BodyAssessmentWriteInput) => Promise<void>;
}>();
const saving = ref(false),
  error = ref('');
const form = reactive({
  assessDate: props.initial?.assessDate ?? new Date().toISOString().slice(0, 10),
  height: props.initial?.height ?? null,
  weight: props.initial?.weight ?? null,
  flexibilityScore: props.initial?.flexibilityScore ?? null,
  coreStrengthScore: props.initial?.coreStrengthScore ?? null,
  postureSpine: props.initial?.postureSpine ?? '',
  posturePelvis: props.initial?.posturePelvis ?? '',
  postureShoulder: props.initial?.postureShoulder ?? '',
  notes: props.initial?.notes ?? '',
});
async function save() {
  saving.value = true;
  error.value = '';
  try {
    await props.onSubmit({ studentId: props.studentId, ...form });
  } catch {
    error.value = '评估保存失败';
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <form class="grid" @submit.prevent="save">
    <label>评估日期<input v-model="form.assessDate" type="date" required /></label
    ><label>身高（cm）<input v-model.number="form.height" type="number" min="0" step="0.1" /></label
    ><label>体重（kg）<input v-model.number="form.weight" type="number" min="0" step="0.1" /></label
    ><label
      >柔韧评分（1-10）<input
        v-model.number="form.flexibilityScore"
        type="number"
        min="1"
        max="10" /></label
    ><label
      >核心评分（1-10）<input
        v-model.number="form.coreStrengthScore"
        type="number"
        min="1"
        max="10" /></label
    ><label>脊柱体态<input v-model.trim="form.postureSpine" /></label
    ><label>骨盆体态<input v-model.trim="form.posturePelvis" /></label
    ><label>肩部体态<input v-model.trim="form.postureShoulder" /></label
    ><label>备注<textarea v-model="form.notes" /></label>
    <p v-if="error">{{ error }}</p>
    <button :disabled="saving">{{ saving ? '保存中…' : '保存评估' }}</button>
  </form>
</template>
<style scoped>
.grid {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
textarea,
button {
  padding: var(--space-3);
  font: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
</style>
