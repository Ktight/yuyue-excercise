<script setup lang="ts">
import type { Schedule } from '@/features/schedules/model';
defineProps<{ schedule: Schedule }>();
defineEmits<{ select: [schedule: Schedule] }>();
</script>
<template>
  <button class="card" @click="$emit('select', schedule)">
    <span class="date"
      >{{ schedule.courseDate
      }}<small>{{ schedule.startTime.slice(0, 5) }}–{{ schedule.endTime.slice(0, 5) }}</small></span
    ><span class="main"
      ><strong>{{ schedule.courseTemplateName }}</strong
      ><small>{{ schedule.trainerName }} · {{ schedule.roomName }}</small
      ><small>预约 {{ schedule.bookingsCount }}/{{ schedule.capacity }}</small></span
    ><span>{{
      schedule.status === 'published'
        ? '可预约'
        : schedule.status === 'completed'
          ? '已完成'
          : '已取消'
    }}</span>
  </button>
</template>
<style scoped>
.card {
  display: flex;
  width: 100%;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}
.card:hover {
  border-color: var(--color-primary-200);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
.date,
.main {
  display: grid;
  gap: var(--space-1);
}
.main {
  flex: 1;
}
small {
  color: var(--color-text-secondary);
}
@media (max-width: 640px) {
  .card {
    padding-inline: 0;
    border-inline: 0;
    border-radius: 0;
  }
}
</style>
