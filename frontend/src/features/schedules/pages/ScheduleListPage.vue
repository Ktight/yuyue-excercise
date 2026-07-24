<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchSchedules } from '@/features/schedules/api';
import type { Schedule, ScheduleStatus } from '@/features/schedules/model';
import { ScheduleCard, ScheduleWeekView } from '@/features/schedules/components';
import { useAuthStore } from '@/features/auth';
import { AppPage, AppLoading, AppEmpty, AppError, AppPagination } from '@/app/components';
const router = useRouter(),
  auth = useAuthStore();
const items = ref<Schedule[]>([]),
  loading = ref(true),
  error = ref(''),
  dateFrom = ref(''),
  dateTo = ref(''),
  status = ref<ScheduleStatus | ''>(''),
  page = ref(1),
  total = ref(0),
  view = ref<'list' | 'week'>('list');
const pageSize = 20;
const canCreate = ['super_admin', 'company_admin', 'store_manager'].includes(auth.userRole ?? '');
async function load() {
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchSchedules({
      page: page.value,
      pageSize: view.value === 'week' ? 100 : pageSize,
      dateFrom: dateFrom.value || undefined,
      dateTo: dateTo.value || undefined,
      status: status.value || undefined,
    });
    items.value = result.items;
    total.value = result.total;
  } catch {
    error.value = '排课加载失败';
  } finally {
    loading.value = false;
  }
}
function applyFilters() {
  page.value = 1;
  void load();
}
function changePage(value: number) {
  page.value = value;
  void load();
}
function selectSchedule(item: Schedule) {
  void router.push(`${auth.userRole === 'trainer' ? '/trainer' : '/admin'}/schedules/${item.id}`);
}
onMounted(load);
</script>
<template>
  <AppPage title="排课管理"
    ><template #header-extra
      ><button v-if="canCreate" @click="router.push('/admin/schedules/new')">
        新建排课
      </button></template
    >
    <div class="view-switch" role="group" aria-label="排课视图">
      <button
        type="button"
        :class="{ active: view === 'list' }"
        @click="
          view = 'list';
          applyFilters();
        "
      >
        列表
      </button>
      <button
        type="button"
        :class="{ active: view === 'week' }"
        @click="
          view = 'week';
          applyFilters();
        "
      >
        周视图
      </button>
    </div>
    <form class="filters" @submit.prevent="applyFilters">
      <input v-model="dateFrom" type="date" /><input v-model="dateTo" type="date" /><select
        v-model="status"
      >
        <option value="">全部状态</option>
        <option value="published">已发布</option>
        <option value="cancelled">已取消</option>
        <option value="completed">已完成</option></select
      ><button>筛选</button>
    </form>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    /><AppEmpty v-else-if="!items.length" description="暂无排课" /><ScheduleWeekView
      v-else-if="view === 'week'"
      :schedules="items"
      :start-date="dateFrom"
      @select="selectSchedule"
    /><ScheduleCard
      v-for="item in items"
      v-else
      :key="item.id"
      :schedule="item"
      @select="selectSchedule"
    />
    <AppPagination
      v-if="view === 'list'"
      :page="page"
      :page-size="pageSize"
      :total="total"
      @change="changePage"
    />
  </AppPage>
</template>
<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.view-switch {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.view-switch button.active {
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border-color: var(--color-brand);
}
input,
select,
button {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
</style>
