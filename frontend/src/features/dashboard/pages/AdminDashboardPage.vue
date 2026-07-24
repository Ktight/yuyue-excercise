<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { getErrorMessage } from '@/shared/api';
import { config } from '@/shared/config';
import { getAdminDashboard } from '../api';
import { BookingTrend, DashboardMetricGrid, TodayScheduleList } from '../components';
import type { AdminDashboardSummary } from '../model';
const summary = ref<AdminDashboardSummary | null>(null),
  loading = ref(true),
  error = ref('');
const snapshotDescription = computed(() => {
  if (!summary.value) return '';
  const generatedAt = new Date(summary.value.generatedAt);
  if (Number.isNaN(generatedAt.getTime())) return `统计时区：${summary.value.timezone}`;
  return `更新于 ${generatedAt.toLocaleString('zh-CN', { hour12: false })} · 统计时区：上海`;
});
async function load() {
  loading.value = true;
  error.value = '';
  try {
    summary.value = await getAdminDashboard();
  } catch (cause) {
    error.value = getErrorMessage(cause, '经营看板加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="数据看板"
    ><template #header-extra
      ><div class="header-actions">
        <span v-if="summary" class="snapshot">{{ snapshotDescription }}</span>
        <button type="button" :disabled="loading" @click="load">刷新</button>
        <RouterLink class="reminder-link" to="/admin/reminders">提醒中心</RouterLink>
      </div></template
    >
    <p v-if="config.enableMock" class="provisional">
      演示数据 · 页面结构与交互已按正式契约实现，关闭 Mock 后即可连接真实服务
    </p>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" />
    <div v-else-if="summary" class="dashboard">
      <DashboardMetricGrid :metrics="summary.metrics" />
      <div class="dashboard__grid">
        <BookingTrend :points="summary.bookingTrend" /><TodayScheduleList
          :items="summary.todaySchedules"
        />
      </div></div
  ></AppPage>
</template>
<style scoped>
.provisional {
  padding: var(--space-3);
  color: var(--color-text-secondary);
  background: var(--color-brand-light);
  border-radius: var(--radius-md);
}
.dashboard {
  display: grid;
  gap: var(--space-5);
}
.dashboard__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: var(--space-5);
}
.reminder-link {
  color: var(--color-brand);
  text-decoration: none;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.snapshot {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}
button {
  padding: var(--space-2) var(--space-3);
  color: var(--color-brand);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  cursor: pointer;
}
button:disabled {
  cursor: wait;
  opacity: 0.6;
}
@media (max-width: 900px) {
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
  .snapshot {
    display: none;
  }
}
</style>
