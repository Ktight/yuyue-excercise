<script setup lang="ts">
import type { TrainingPlan } from '../model';
defineProps<{ plan: TrainingPlan }>();
defineEmits<{ select: [TrainingPlan] }>();
const labels = { active: '进行中', paused: '已暂停', completed: '已完成' };
</script>
<template>
  <article @click="$emit('select', plan)">
    <div>
      <strong>{{ plan.title }}</strong>
      <p>{{ plan.studentName }} · {{ plan.trainerName }}</p>
      <small
        >{{ plan.startDate }} 至 {{ plan.endDate }} · 每周
        {{ plan.targetFrequencyPerWeek }} 次</small
      >
    </div>
    <div class="progress">
      <span>{{ labels[plan.status] }}</span
      ><strong>{{ plan.progressPercentage }}%</strong>
    </div>
  </article>
</template>
<style scoped>
article {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  cursor: pointer;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
p,
small {
  color: var(--color-text-secondary);
}
.progress {
  display: grid;
  align-content: center;
  text-align: right;
  color: var(--color-brand);
}
</style>
