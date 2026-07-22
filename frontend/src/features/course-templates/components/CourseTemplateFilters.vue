<script setup lang="ts">
import { reactive } from 'vue';
import type {
  CourseCategory,
  CourseDifficulty,
  CourseStatus,
  CourseTemplateQuery,
} from '@/features/course-templates/model';
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  STATUS_LABELS,
} from '@/features/course-templates/model';
const props = defineProps<{ value: CourseTemplateQuery }>();
const emit = defineEmits<{ apply: [query: CourseTemplateQuery] }>();
const form = reactive<{
  search: string;
  category: CourseCategory | '';
  difficulty: CourseDifficulty | '';
  status: CourseStatus | '';
}>({
  search: props.value.search ?? '',
  category: props.value.category ?? '',
  difficulty: props.value.difficulty ?? '',
  status: props.value.status ?? '',
});
function applyFilters() {
  emit('apply', {
    search: form.search.trim() || undefined,
    category: form.category || undefined,
    difficulty: form.difficulty || undefined,
    status: form.status || undefined,
  });
}
</script>
<template>
  <form class="filters" @submit.prevent="applyFilters">
    <input v-model="form.search" aria-label="搜索课程模板" placeholder="搜索课程名称" />
    <select v-model="form.category" aria-label="课程分类">
      <option value="">全部分类</option>
      <option v-for="(label, option) in CATEGORY_LABELS" :key="option" :value="option">
        {{ label }}
      </option>
    </select>
    <select v-model="form.difficulty" aria-label="课程难度">
      <option value="">全部难度</option>
      <option v-for="(label, option) in DIFFICULTY_LABELS" :key="option" :value="option">
        {{ label }}
      </option>
    </select>
    <select v-model="form.status" aria-label="课程状态">
      <option value="">全部状态</option>
      <option v-for="(label, option) in STATUS_LABELS" :key="option" :value="option">
        {{ label }}
      </option>
    </select>
    <button type="submit">查询</button>
  </form>
</template>
<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.filters input,
.filters select,
.filters button {
  min-height: var(--control-height-md);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  background: var(--color-surface);
}
</style>
