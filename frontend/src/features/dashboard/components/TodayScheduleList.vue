<script setup lang="ts">
import { AppEmpty } from '@/app/components';
import type { DashboardScheduleItem } from '../model';
defineProps<{ items: DashboardScheduleItem[] }>();
</script>

<template>
  <section class="panel">
    <div class="panel__header">
      <h2>今日课程</h2>
      <RouterLink to="/admin/schedules">查看全部</RouterLink>
    </div>
    <AppEmpty v-if="!items.length" description="今天暂无课程" />
    <ul v-else>
      <li v-for="item in items" :key="item.id">
        <time>{{ item.time }}</time>
        <span
          ><strong>{{ item.courseName }}</strong
          ><small>{{ item.trainerName }} · {{ item.roomName }}</small></span
        >
        <em :class="{ full: item.booked >= item.capacity }"
          >{{ item.booked }}/{{ item.capacity }}</em
        >
      </li>
    </ul>
  </section>
</template>

<style scoped>
.panel {
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h2 {
  margin: 0;
  font-size: var(--text-lg);
}
a {
  color: var(--color-brand);
  text-decoration: none;
  font-size: var(--text-sm);
}
ul {
  margin: var(--space-3) 0 0;
  padding: 0;
  list-style: none;
}
li {
  display: grid;
  grid-template-columns: 58px 1fr auto;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border-light);
}
li:last-child {
  border-bottom: 0;
}
time {
  font-weight: var(--font-semibold);
  color: var(--color-brand);
}
strong,
small {
  display: block;
}
small {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
}
em {
  padding: var(--space-1) var(--space-2);
  font-style: normal;
  background: var(--color-brand-light);
  border-radius: var(--radius-full);
}
em.full {
  color: var(--color-danger);
}
</style>
