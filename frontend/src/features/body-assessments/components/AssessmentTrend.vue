<script setup lang="ts">
import { computed } from 'vue';
import type { BodyAssessmentDto } from '@/features/body-assessments/model';
const props = defineProps<{ assessments: BodyAssessmentDto[] }>();
const hasData = computed(() => props.assessments.length >= 2);
</script>
<template>
  <div class="at">
    <div v-if="!hasData" class="at__empty">数据不足，需要至少 2 条记录才能展示趋势</div>
    <div v-else class="at__chart">
      <div class="at__label">体重趋势 (kg)</div>
      <div class="at__bars">
        <div v-for="a in assessments" :key="a.id" class="at__bar-col">
          <div class="at__bar" :style="{ height: `${(a.weight || 0) * 2}px` }"></div>
          <div class="at__bar-date">{{ a.assessed_at?.slice(0, 10) }}</div>
          <div class="at__bar-val">{{ a.weight }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.at {
  padding: var(--space-4);
}
.at__empty {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
}
.at__label {
  margin-bottom: var(--space-4);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
}
.at__bars {
  display: flex;
  align-items: flex-end;
  gap: var(--space-6);
  min-height: 120px;
}
.at__bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
}
.at__bar {
  width: 32px;
  background: var(--color-brand);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  min-height: 4px;
  transition: height var(--transition-normal);
}
.at__bar-date {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.at__bar-val {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}
</style>
