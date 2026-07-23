<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppError, AppLoading, AppPage } from '@/app/components';
import { getAdminDashboard } from '../api';
import { BookingTrend, DashboardMetricGrid, TodayScheduleList } from '../components';
import type { AdminDashboardSummary } from '../model';
const summary = ref<AdminDashboardSummary | null>(null),
  loading = ref(true),
  error = ref('');
async function load() {
  loading.value = true;
  error.value = '';
  try {
    summary.value = await getAdminDashboard();
  } catch {
    error.value = '看板契约尚未冻结，当前真实接口无法安全解析';
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="数据看板"
    ><template #header-extra
      ><RouterLink class="reminder-link" to="/admin/reminders">提醒中心</RouterLink></template
    >
    <p class="provisional">演示数据 · 统计口径、租户范围和时区等待 Phase 11 契约冻结</p>
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
@media (max-width: 900px) {
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
