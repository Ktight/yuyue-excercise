<script setup lang="ts">
import type { Schedule } from '@/features/schedules/model';
defineProps<{ schedule: Schedule }>();
defineEmits<{ select: [] }>();
</script>
<template>
  <button class="card" @click="$emit('select')">
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
</style>
