<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppCard, AppError, AppLoading, AppPage, AppStatusTag } from '@/app/components';
import { fetchStudentPlan } from '../api';
import type { StudentPlanSummary } from '../model';

const route = useRoute();
const router = useRouter();
const item = ref<StudentPlanSummary | null>(null);
const loading = ref(true);
const error = ref('');
const id = computed(() => Number(route.params.id));
const labels = { active: '进行中', paused: '已暂停', completed: '已完成' };
const tagTypes = { active: 'success', paused: 'warning', completed: 'default' } as const;

async function load() {
  loading.value = true;
  error.value = '';
  try {
    item.value = await fetchStudentPlan(id.value);
  } catch {
    error.value = '训练计划不存在、无权访问或接口尚未交付';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <AppPage :title="item?.title || '训练计划详情'">
    <template #header-extra><button @click="router.back()">返回</button></template>
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="load" />
    <div v-else-if="item" class="plan-detail">
      <AppCard class="plan-detail__hero">
        <div>
          <p>{{ item.trainerName }} · {{ item.startDate }} 至 {{ item.endDate }}</p>
          <h2>{{ item.goalDescription }}</h2>
        </div>
        <AppStatusTag :label="labels[item.status]" :type="tagTypes[item.status]" />
      </AppCard>
      <AppCard>
        <div class="progress-heading">
          <div>
            <span>计划完成度</span>
            <strong>{{ item.progressPercentage }}%</strong>
          </div>
          <p>
            已完成 {{ item.completedSessionsCount }} 节 · 目标每周
            {{ item.targetFrequencyPerWeek }} 次
          </p>
        </div>
        <div class="progress" :aria-label="`计划进度 ${item.progressPercentage}%`">
          <span :style="{ width: `${item.progressPercentage}%` }" />
        </div>
      </AppCard>
      <AppCard>
        <h3>训练重点</h3>
        <div class="tags">
          <span v-for="tag in item.focusTags" :key="tag">{{ tag }}</span>
        </div>
      </AppCard>
      <div class="actions">
        <RouterLink to="/student/history">查看相关训练记录</RouterLink>
        <RouterLink to="/student/reports">查看阶段报告</RouterLink>
      </div>
    </div>
  </AppPage>
</template>

<style scoped>
button {
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
}
.plan-detail {
  display: grid;
  gap: var(--space-4);
}
.plan-detail__hero,
.progress-heading,
.actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}
.plan-detail__hero p,
.progress-heading p,
.progress-heading span {
  color: var(--color-text-secondary);
}
.plan-detail__hero h2 {
  max-width: 760px;
  margin: var(--space-2) 0 0;
  font-size: var(--text-xl);
}
.progress-heading div {
  display: grid;
}
.progress-heading strong {
  color: var(--color-brand);
  font-size: var(--text-3xl);
}
.progress {
  height: 10px;
  margin-top: var(--space-4);
  overflow: hidden;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
}
.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand), var(--color-accent));
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.tags span {
  padding: var(--space-2) var(--space-3);
  color: var(--color-brand);
  background: var(--color-brand-light);
  border-radius: var(--radius-full);
}
.actions {
  justify-content: flex-start;
}
.actions a {
  padding: var(--space-3) var(--space-4);
  color: var(--color-brand);
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
}
@media (max-width: 600px) {
  .plan-detail__hero,
  .progress-heading,
  .actions {
    display: grid;
  }
}
</style>
