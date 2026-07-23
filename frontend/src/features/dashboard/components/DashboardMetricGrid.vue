<script setup lang="ts">
import type { DashboardMetric } from '../model';
defineProps<{ metrics: DashboardMetric[] }>();
</script>

<template>
  <section class="metric-grid" aria-label="经营指标">
    <article v-for="item in metrics" :key="item.key" class="metric-card">
      <p>{{ item.label }}</p>
      <strong
        >{{ item.value }}<small>{{ item.unit }}</small></strong
      >
      <span>{{ item.hint }}</span>
    </article>
  </section>
</template>

<style scoped>
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}
.metric-card {
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xs);
}
.metric-card p,
.metric-card span {
  margin: 0;
  color: var(--color-text-secondary);
}
.metric-card strong {
  display: block;
  margin: var(--space-3) 0 var(--space-2);
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
}
.metric-card small {
  margin-left: var(--space-1);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
}
.metric-card span {
  font-size: var(--text-xs);
}
@media (max-width: 900px) {
  .metric-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 520px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
