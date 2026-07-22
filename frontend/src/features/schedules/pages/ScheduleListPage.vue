<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchSchedules } from '@/features/schedules/api';
import type { Schedule, ScheduleStatus } from '@/features/schedules/model';
import { ScheduleCard } from '@/features/schedules/components';
import { useAuthStore } from '@/features/auth';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';
const router = useRouter(),
  auth = useAuthStore();
const items = ref<Schedule[]>([]),
  loading = ref(true),
  error = ref(''),
  dateFrom = ref(''),
  dateTo = ref(''),
  status = ref<ScheduleStatus | ''>('');
const canCreate = ['super_admin', 'company_admin', 'store_manager'].includes(auth.userRole ?? '');
async function load() {
  loading.value = true;
  try {
    items.value = (
      await fetchSchedules({
        dateFrom: dateFrom.value || undefined,
        dateTo: dateTo.value || undefined,
        status: status.value || undefined,
      })
    ).items;
  } catch {
    error.value = '排课加载失败';
  } finally {
    loading.value = false;
  }
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
    <form class="filters" @submit.prevent="load">
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
      @retry="load" /><AppEmpty v-else-if="!items.length" description="暂无排课" /><ScheduleCard
      v-for="item in items"
      v-else
      :key="item.id"
      :schedule="item"
      @select="
        router.push(`${auth.userRole === 'trainer' ? '/trainer' : '/admin'}/schedules/${item.id}`)
      "
  /></AppPage>
</template>
<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
input,
select,
button {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
</style>
