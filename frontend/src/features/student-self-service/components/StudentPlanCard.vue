<script setup lang="ts">
import { AppCard, AppStatusTag } from '@/app/components';
import type { StudentPlanSummary } from '../model';

defineProps<{ plan: StudentPlanSummary }>();
defineEmits<{ select: [plan: StudentPlanSummary] }>();

const labels = { active: '进行中', paused: '已暂停', completed: '已完成' };
const tagTypes = { active: 'success', paused: 'warning', completed: 'default' } as const;
</script>

<template>
  <AppCard class="plan-card" interactive @click="$emit('select', plan)">
    <div class="plan-card__heading">
      <div>
        <p>{{ plan.trainerName }} · 每周 {{ plan.targetFrequencyPerWeek }} 次</p>
        <h2>{{ plan.title }}</h2>
      </div>
      <AppStatusTag :label="labels[plan.status]" :type="tagTypes[plan.status]" />
    </div>
    <p class="plan-card__goal">{{ plan.goalDescription }}</p>
    <div class="plan-card__progress">
      <span :style="{ width: `${plan.progressPercentage}%` }" />
    </div>
    <div class="plan-card__meta">
      <span>{{ plan.startDate }} 至 {{ plan.endDate }}</span>
      <strong>{{ plan.completedSessionsCount }} 节 · {{ plan.progressPercentage }}%</strong>
    </div>
    <div class="plan-card__tags">
      <span v-for="tag in plan.focusTags" :key="tag">{{ tag }}</span>
    </div>
  </AppCard>
</template>

<style scoped>
.plan-card {
  display: grid;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}
.plan-card__heading,
.plan-card__meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}
.plan-card__heading p,
.plan-card__goal,
.plan-card__meta {
  margin: 0;
  color: var(--color-text-secondary);
}
h2 {
  margin: var(--space-1) 0 0;
}
.plan-card__progress {
  height: 8px;
  overflow: hidden;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
}
.plan-card__progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand), var(--color-accent));
}
.plan-card__meta strong {
  color: var(--color-brand);
}
.plan-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.plan-card__tags span {
  padding: 2px var(--space-2);
  color: var(--color-brand);
  font-size: var(--text-xs);
  background: var(--color-brand-light);
  border-radius: var(--radius-full);
}
@media (max-width: 560px) {
  .plan-card__heading,
  .plan-card__meta {
    display: grid;
  }
}
</style>
