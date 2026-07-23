<script setup lang="ts">
import { reactive, ref } from 'vue';
import { PoseSequenceEditor } from '@/features/class-templates';
import type { ClassRecord, ClassRecordWriteInput } from '@/features/class-records/model';
const p = defineProps<{
  initial?: ClassRecord;
  attendanceId?: number;
  readonly?: boolean;
  onSubmit: (v: ClassRecordWriteInput) => Promise<unknown>;
}>();
const form = reactive<ClassRecordWriteInput>({
    attendanceId: p.initial?.attendanceId ?? p.attendanceId ?? 0,
    planId: p.initial?.planId ?? null,
    theme: p.initial?.theme ?? '',
    poseSequence: p.initial?.poseSequence ?? { warmup: [], main: [], cooldown: [] },
    trainerNotes: p.initial?.trainerNotes ?? '',
    homework: p.initial?.homework ?? '',
    completionRating: p.initial?.completionRating ?? null,
    improvementTags: p.initial?.improvementTags ?? [],
    nextFocus: p.initial?.nextFocus ?? '',
  }),
  tags = ref(form.improvementTags.join('、')),
  busy = ref(false),
  error = ref('');
async function submit() {
  if (!form.attendanceId || !form.theme.trim()) {
    error.value = '请填写考勤编号和课堂主题';
    return;
  }
  busy.value = true;
  try {
    await p.onSubmit({
      ...form,
      improvementTags: tags.value
        .split(/[、,，]/)
        .map((x) => x.trim())
        .filter(Boolean),
    });
  } catch {
    error.value = '课堂记录保存失败';
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <p v-if="error" role="alert">{{ error }}</p>
    <div class="grid">
      <label
        >考勤编号<input
          v-model.number="form.attendanceId"
          type="number"
          min="1"
          required
          :disabled="readonly || Boolean(initial)" /></label
      ><label
        >课堂主题<input v-model="form.theme" required maxlength="200" :disabled="readonly" /></label
      ><label
        >完成评分<input
          v-model.number="form.completionRating"
          type="number"
          min="1"
          max="5"
          :disabled="readonly" /></label
      ><label>改进标签<input v-model="tags" placeholder="以逗号分隔" :disabled="readonly" /></label>
    </div>
    <PoseSequenceEditor v-model="form.poseSequence" :disabled="readonly" /><label
      >教练记录<textarea v-model="form.trainerNotes" rows="3" :disabled="readonly" /></label
    ><label>课后作业<textarea v-model="form.homework" rows="3" :disabled="readonly" /></label
    ><label>下次重点<input v-model="form.nextFocus" maxlength="200" :disabled="readonly" /></label
    ><button v-if="!readonly" :disabled="busy">{{ busy ? '保存中…' : '保存课堂记录' }}</button>
  </form>
</template>
<style scoped>
form {
  display: grid;
  gap: var(--space-4);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
textarea {
  padding: var(--space-2);
}
button {
  justify-self: start;
  padding: var(--space-3) var(--space-5);
  background: var(--color-brand);
  color: white;
  border: 0;
  border-radius: var(--radius-button);
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
