<script setup lang="ts">
import type { CourseTemplateDto } from '@/features/course-templates/model';
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  STATUS_LABELS,
} from '@/features/course-templates/model';

defineProps<{ templates: CourseTemplateDto[]; loading?: boolean }>();
defineEmits<{ select: [template: CourseTemplateDto] }>();
</script>

<template>
  <div class="ct-list">
    <div v-if="loading" class="ct-list__msg">加载中...</div>
    <div v-else-if="templates.length === 0" class="ct-list__msg">暂无课程模板</div>
    <div v-for="t in templates" :key="t.id" class="ct-list__item" @click="$emit('select', t)">
      <div class="ct-list__info">
        <div class="ct-list__name">{{ t.name }}</div>
        <div class="ct-list__meta">
          <span>{{ CATEGORY_LABELS[t.category] }}</span
          >· <span>{{ DIFFICULTY_LABELS[t.difficulty] }}</span
          >· <span>{{ t.duration_minutes }}分钟</span>·
          <span>容量{{ t.capacity }}人</span>
        </div>
      </div>
      <span class="ct-list__status" :class="{ 'is-inactive': t.status === 'inactive' }">
        {{ STATUS_LABELS[t.status] }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.ct-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.ct-list__msg {
  padding: var(--space-8);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
.ct-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
}
.ct-list__item:hover {
  background: var(--color-brand-light);
}
.ct-list__name {
  font-weight: var(--font-medium);
}
.ct-list__meta {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
  display: flex;
  gap: var(--space-1);
}
.ct-list__status {
  font-size: var(--text-xs);
  padding: 2px var(--space-2);
  border-radius: var(--radius-tag);
  background: var(--color-success-50);
  color: var(--color-success-600);
  white-space: nowrap;
}
.ct-list__status.is-inactive {
  background: var(--color-neutral-100);
  color: var(--color-text-tertiary);
}
</style>
