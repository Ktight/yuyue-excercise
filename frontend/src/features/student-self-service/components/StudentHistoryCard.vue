<script setup lang="ts">
import { AppCard, AppStatusTag } from '@/app/components';
import type { StudentClassRecordSummary } from '../model';

defineProps<{ record: StudentClassRecordSummary }>();
defineEmits<{ select: [record: StudentClassRecordSummary] }>();
</script>

<template>
  <AppCard class="history-card" interactive @click="$emit('select', record)">
    <div class="history-card__date">
      <strong>{{ record.classDate.slice(8, 10) }}</strong>
      <span>{{ record.classDate.slice(5, 7) }} 月</span>
    </div>
    <div class="history-card__body">
      <div class="history-card__heading">
        <div>
          <h2>{{ record.theme }}</h2>
          <p>{{ record.trainerName }} · 第 {{ record.sessionNumber }} 节</p>
        </div>
        <AppStatusTag
          :label="record.hasFeedback ? '已反馈' : '待反馈'"
          :type="record.hasFeedback ? 'success' : 'warning'"
        />
      </div>
      <div class="history-card__tags">
        <span v-for="tag in record.improvementTags" :key="tag">{{ tag }}</span>
      </div>
      <p v-if="record.homework" class="history-card__homework">课后练习：{{ record.homework }}</p>
    </div>
    <span class="history-card__arrow" aria-hidden="true">→</span>
  </AppCard>
</template>

<style scoped>
.history-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}
.history-card__date {
  display: grid;
  width: 56px;
  height: 60px;
  place-content: center;
  text-align: center;
  background: var(--color-brand-light);
  border-radius: var(--radius-lg);
}
.history-card__date strong {
  color: var(--color-brand);
  font-size: var(--text-xl);
}
.history-card__date span {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
.history-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}
h2 {
  margin: 0;
  font-size: var(--text-lg);
}
p {
  margin: var(--space-1) 0;
  color: var(--color-text-secondary);
}
.history-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}
.history-card__tags span {
  padding: 2px var(--space-2);
  color: var(--color-brand);
  font-size: var(--text-xs);
  background: var(--color-brand-light);
  border-radius: var(--radius-full);
}
.history-card__homework {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.history-card__arrow {
  color: var(--color-brand);
  font-size: var(--text-xl);
}
@media (max-width: 600px) {
  .history-card {
    grid-template-columns: auto 1fr;
  }
  .history-card__heading {
    display: grid;
  }
  .history-card__arrow {
    display: none;
  }
}
</style>
