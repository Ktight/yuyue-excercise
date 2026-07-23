<script setup lang="ts">
import { computed } from 'vue';
import { toLocalDateInputValue } from '@/shared/date/local-date';
import type { Schedule } from '../model';

const props = defineProps<{ schedules: Schedule[]; startDate?: string }>();
const emit = defineEmits<{ select: [schedule: Schedule] }>();

const days = computed(() => {
  const start = props.startDate ? new Date(`${props.startDate}T00:00:00`) : new Date();
  const monday = new Date(start);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = toLocalDateInputValue(date);

    return {
      key,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      weekday: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][index],
      items: props.schedules
        .filter((item) => item.courseDate === key)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    };
  });
});
</script>
<template>
  <div class="week-view" aria-label="排课周视图">
    <section v-for="day in days" :key="day.key" class="day">
      <header>
        <strong>{{ day.weekday }}</strong
        ><span>{{ day.label }}</span>
      </header>
      <p v-if="!day.items.length" class="empty">无课程</p>
      <button v-for="item in day.items" :key="item.id" @click="emit('select', item)">
        <time>{{ item.startTime.slice(0, 5) }}</time
        ><strong>{{ item.courseTemplateName }}</strong
        ><small>{{ item.trainerName }} · {{ item.roomName }}</small
        ><span>{{ item.bookingsCount }}/{{ item.capacity }}</span>
      </button>
    </section>
  </div>
</template>
<style scoped>
.week-view {
  display: grid;
  grid-template-columns: repeat(7, minmax(140px, 1fr));
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-3);
}
.day {
  min-height: 280px;
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
header {
  display: flex;
  justify-content: space-between;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border-light);
}
header span,
.empty {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
.day button {
  display: grid;
  width: 100%;
  gap: 3px;
  margin-top: var(--space-2);
  padding: var(--space-3);
  text-align: left;
  background: var(--color-brand-light);
  border: 0;
  border-radius: var(--radius-md);
  cursor: pointer;
}
.day button time {
  color: var(--color-brand);
  font-weight: var(--font-semibold);
}
.day button small,
.day button span {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
</style>
