<script setup lang="ts">
import { computed } from 'vue';
import type { DashboardTrendPoint } from '../model';
const props = defineProps<{ points: DashboardTrendPoint[] }>();
const maximum = computed(() => Math.max(1, ...props.points.map((point) => point.value)));
</script>

<template>
  <section class="panel">
    <h2>近七日预约趋势</h2>
    <div class="bars" aria-label="近七日预约量">
      <div v-for="point in points" :key="point.label" class="bar">
        <span>{{ point.value }}</span>
        <i :style="{ height: `${Math.max(8, (point.value / maximum) * 100)}%` }" />
        <small>{{ point.label }}</small>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  min-height: 300px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
h2 {
  margin: 0;
  font-size: var(--text-lg);
}
.bars {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  height: 220px;
  gap: var(--space-3);
  padding-top: var(--space-5);
}
.bar {
  display: grid;
  grid-template-rows: auto 1fr auto;
  justify-items: center;
  height: 100%;
  gap: var(--space-2);
}
.bar i {
  align-self: end;
  width: min(32px, 70%);
  min-height: 8px;
  background: linear-gradient(180deg, var(--color-brand), var(--color-primary-200));
  border-radius: var(--radius-md) var(--radius-md) 3px 3px;
}
.bar span,
.bar small {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}
</style>
