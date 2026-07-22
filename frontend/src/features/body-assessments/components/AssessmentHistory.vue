<script setup lang="ts">
import type { BodyAssessment } from '@/features/body-assessments/model';
withDefaults(defineProps<{ assessments: BodyAssessment[]; canDelete?: boolean }>(), {
  canDelete: false,
});
defineEmits<{ edit: [BodyAssessment]; remove: [number] }>();
</script>
<template>
  <div class="history">
    <article v-for="item in assessments" :key="item.id">
      <header>
        <strong>{{ item.assessDate }}</strong
        ><span
          ><button @click="$emit('edit', item)">编辑</button
          ><button v-if="canDelete" @click="$emit('remove', item.id)">删除</button></span
        >
      </header>
      <p>身高 {{ item.height ?? '—' }} cm · 体重 {{ item.weight ?? '—' }} kg</p>
      <p>柔韧 {{ item.flexibilityScore ?? '—' }} · 核心 {{ item.coreStrengthScore ?? '—' }}</p>
      <small>{{ item.notes || '无备注' }}</small>
    </article>
    <p v-if="!assessments.length">暂无身体评估记录</p>
  </div>
</template>
<style scoped>
.history {
  display: grid;
  gap: var(--space-3);
}
article {
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
header {
  display: flex;
  justify-content: space-between;
}
button {
  margin-left: var(--space-2);
  color: var(--color-brand);
  background: none;
  border: 0;
}
p,
small {
  color: var(--color-text-secondary);
}
</style>
