<script setup lang="ts">
import type { BodyAssessmentDto } from '@/features/body-assessments/model';
defineProps<{ assessments: BodyAssessmentDto[]; loading?: boolean }>();
</script>
<template>
  <div class="ah">
    <div v-if="loading" class="ah__msg">加载中...</div>
    <div v-else-if="assessments.length === 0" class="ah__msg">暂无评估记录</div>
    <div v-for="a in assessments" :key="a.id" class="ah__item">
      <div>
        <strong>{{ a.assessed_at?.slice(0, 10) }}</strong>
      </div>
      <div class="ah__metrics">
        身高 {{ a.height }}cm · 体重 {{ a.weight }}kg · BMI {{ a.bmi || '-' }} · 体脂
        {{ a.body_fat_pct ?? '-' }}%
      </div>
      <div v-if="a.notes" class="ah__notes">{{ a.notes }}</div>
    </div>
  </div>
</template>
<style scoped>
.ah {
  display: flex;
  flex-direction: column;
}
.ah__msg {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
}
.ah__item {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.ah__metrics {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}
.ah__notes {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
</style>
