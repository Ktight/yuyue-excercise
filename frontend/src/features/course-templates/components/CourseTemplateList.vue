<script setup lang="ts">
import type { CourseTemplate } from '@/features/course-templates/model';
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  STATUS_LABELS,
} from '@/features/course-templates/model';

defineProps<{ templates: CourseTemplate[]; loading?: boolean }>();
defineEmits<{ select: [template: CourseTemplate] }>();
</script>

<template>
  <div class="ct-list">
    <div v-if="loading" class="ct-list__msg">加载中…</div>
    <div v-else-if="templates.length === 0" class="ct-list__msg">暂无课程模板</div>
    <button
      v-for="template in templates"
      :key="template.id"
      class="ct-list__item"
      type="button"
      @click="$emit('select', template)"
    >
      <div class="ct-list__info">
        <div class="ct-list__name">{{ template.name }}</div>
        <div class="ct-list__meta">
          <span>{{ CATEGORY_LABELS[template.category] }}</span
          ><span>·</span> <span>{{ DIFFICULTY_LABELS[template.difficulty] }}</span
          ><span>·</span> <span>{{ template.durationMinutes }} 分钟</span><span>·</span>
          <span>容量 {{ template.maxCapacity }} 人</span>
        </div>
      </div>
      <span class="ct-list__status" :class="{ 'is-inactive': template.status === 'inactive' }">{{
        STATUS_LABELS[template.status]
      }}</span>
    </button>
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
  width: 100%;
  padding: var(--space-4) var(--space-5);
  text-align: left;
  color: inherit;
  background: transparent;
  border: 0;
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
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: 2px;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.ct-list__status {
  padding: 2px var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-success-600);
  white-space: nowrap;
  background: var(--color-success-50);
  border-radius: var(--radius-tag);
}
.ct-list__status.is-inactive {
  color: var(--color-text-tertiary);
  background: var(--color-neutral-100);
}
</style>
