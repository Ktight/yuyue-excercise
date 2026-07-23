<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AppEmpty, AppError, AppLoading, AppPage } from '@/app/components';
import { fetchStudentPlans } from '../api';
import { StudentPlanCard } from '../components';
import type { StudentPlanStatus, StudentPlanSummary } from '../model';

const router = useRouter();
const items = ref<StudentPlanSummary[]>([]);
const status = ref<StudentPlanStatus | ''>('');
const loading = ref(true);
const error = ref('');
const visibleItems = computed(() =>
  status.value ? items.value.filter((item) => item.status === status.value) : items.value,
);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await fetchStudentPlans();
  } catch {
    error.value = '训练计划接口尚未交付或数据格式不匹配';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <AppPage title="我的训练计划">
    <p class="provisional">演示数据 · 学员仅可查看自己的计划，不复用教练管理接口</p>
    <label class="status-filter">
      计划状态
      <select v-model="status">
        <option value="">全部</option>
        <option value="active">进行中</option>
        <option value="paused">已暂停</option>
        <option value="completed">已完成</option>
      </select>
    </label>
    <AppLoading v-if="loading" />
    <AppError v-else-if="error" :message="error" show-retry @retry="load" />
    <AppEmpty v-else-if="!visibleItems.length" description="当前筛选下暂无训练计划" />
    <StudentPlanCard
      v-for="item in visibleItems"
      v-else
      :key="item.id"
      :plan="item"
      @select="router.push(`/student/plans/${item.id}`)"
    />
  </AppPage>
</template>

<style scoped>
.provisional {
  margin: 0 0 var(--space-4);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  background: var(--color-brand-light);
  border-radius: var(--radius-md);
}
.status-filter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  color: var(--color-text-secondary);
}
select {
  min-height: 40px;
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}
</style>
