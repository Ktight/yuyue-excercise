<script setup lang="ts">
import { feedbackFeelingLabel } from '../model';
import type { StudentFeedback } from '../model';

defineProps<{ feedback: StudentFeedback | null }>();
</script>

<template>
  <article class="summary">
    <h3>学员反馈</h3>
    <p v-if="!feedback">学员暂未反馈</p>
    <template v-else>
      <strong>{{ feedbackFeelingLabel(feedback.feeling) }}</strong>
      <p v-if="feedback.improvementNote">{{ feedback.improvementNote }}</p>
      <p>{{ feedback.comment || '未填写文字反馈' }}</p>
      <div v-if="feedback.photoUrls.length" class="photos">
        <img v-for="url in feedback.photoUrls" :key="url" :src="url" alt="学员反馈照片" />
      </div>
      <small>{{ feedback.createdAt }}</small>
    </template>
  </article>
</template>

<style scoped>
.summary {
  padding: var(--space-4);
  margin-top: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.photos {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
}
img {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: var(--radius-control);
}
</style>
