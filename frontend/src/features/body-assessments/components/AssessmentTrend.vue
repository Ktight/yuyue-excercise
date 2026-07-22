<script setup lang="ts">
import type { AssessmentTrendData } from '@/features/body-assessments/model';
defineProps<{ trend: AssessmentTrendData | null }>();
</script>
<template>
  <section class="trend">
    <h3>趋势数据</h3>
    <p v-if="!trend || !trend.points.length">暂无有效趋势点</p>
    <template v-else
      ><p>{{ trend.hasTrend ? '已形成趋势' : '至少需要两个有效数据点' }}</p>
      <ol>
        <li v-for="point in trend.points" :key="point.assessmentId">
          {{ point.assessDate }}：{{ point.value }} {{ trend.unit }}
        </li>
      </ol></template
    >
  </section>
</template>
<style scoped>
.trend {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
</style>
