<script setup lang="ts">
import { ref } from 'vue';
import type { FeedbackFeeling, FeedbackWriteInput } from '../model';
import FeelingSelector from './FeelingSelector.vue';

const props = defineProps<{
  classRecordId: number;
  onSubmit: (value: FeedbackWriteInput) => Promise<void>;
}>();
const feeling = ref<FeedbackFeeling>('moderate');
const comment = ref('');
const photosText = ref('');
const submitting = ref(false);

async function submit() {
  submitting.value = true;
  try {
    await props.onSubmit({
      classRecordId: props.classRecordId,
      feeling: feeling.value,
      comment: comment.value.trim(),
      photoUrls: photosText.value
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 6),
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <FeelingSelector v-model="feeling" />
    <label>文字反馈<textarea v-model="comment" maxlength="500" rows="6" /></label>
    <label
      >照片地址（演示模式，每行一个，最多 6 张）
      <textarea v-model="photosText" rows="3" />
    </label>
    <p class="hint">真实照片上传等待后端媒体契约，当前输入不会调用上传服务。</p>
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
