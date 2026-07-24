<script setup lang="ts">
import { ref } from 'vue';
import { useUnsavedChangesGuard } from '@/app/composables';
import type { FeedbackFeeling, FeedbackWriteInput } from '../model';
import FeelingSelector from './FeelingSelector.vue';

const props = defineProps<{
  classRecordId: number;
  onSubmit: (value: FeedbackWriteInput) => Promise<void>;
}>();
const feeling = ref<FeedbackFeeling>('moderate');
const improvementNote = ref('');
const comment = ref('');
const submitting = ref(false);
const { runGuardedSubmit } = useUnsavedChangesGuard({
  source: () => ({
    feeling: feeling.value,
    improvementNote: improvementNote.value,
    comment: comment.value,
  }),
});

async function submit() {
  submitting.value = true;
  try {
    await runGuardedSubmit(() =>
      props.onSubmit({
        classRecordId: props.classRecordId,
        feeling: feeling.value,
        improvementNote: improvementNote.value.trim(),
        comment: comment.value.trim(),
      }),
    );
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <FeelingSelector v-model="feeling" />
    <label>改善感受<textarea v-model="improvementNote" maxlength="1000" rows="3" /></label>
    <label>补充反馈<textarea v-model="comment" maxlength="2000" rows="6" /></label>
    <p class="hint">Phase 10 正式契约暂不支持反馈照片。</p>
    <button :disabled="submitting">{{ submitting ? '提交中…' : '提交反馈' }}</button>
  </form>
</template>

<style scoped>
form,
label {
  display: grid;
  gap: var(--space-3);
}
textarea {
  width: 100%;
  padding: var(--space-3);
}
.hint {
  color: var(--color-text-secondary);
}
button {
  justify-self: start;
}
</style>
