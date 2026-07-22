<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { cancelBooking, fetchBookings } from '@/features/bookings/api';
import type { Booking } from '@/features/bookings/model';
import { BookingCard } from '@/features/bookings/components';
import { AppPage, AppLoading, AppEmpty, AppError, AppPagination } from '@/app/components';
import { getErrorMessage } from '@/shared/api';
const items = ref<Booking[]>([]),
  loading = ref(true),
  error = ref(''),
  actionError = ref(''),
  cancellingId = ref<number | null>(null),
  status = ref<'booked' | 'cancelled' | ''>(''),
  page = ref(1),
  total = ref(0);
const pageSize = 20;
async function load() {
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchBookings({
      page: page.value,
      pageSize,
      status: status.value || undefined,
    });
    items.value = result.items;
    total.value = result.total;
  } catch {
    error.value = '预约加载失败';
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
async function cancel(id: number) {
  if (cancellingId.value !== null || !globalThis.confirm('确认取消这条预约？')) return;
  cancellingId.value = id;
  actionError.value = '';
  try {
    await cancelBooking(id);
    await load();
  } catch (cause) {
    actionError.value = getErrorMessage(cause, '取消预约失败，请稍后重试');
  } finally {
    cancellingId.value = null;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="预约记录"
    ><form class="filters" @submit.prevent="applyFilters">
      <select v-model="status">
        <option value="">全部预约</option>
        <option value="booked">已预约</option>
        <option value="cancelled">已取消</option></select
      ><button>查询</button>
    </form>
    <p v-if="actionError" role="alert">{{ actionError }}</p>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    /><AppEmpty v-else-if="!items.length" description="暂无预约" /><BookingCard
      v-for="item in items"
      v-else
      :key="item.id"
      :booking="item"
      :cancelling="cancellingId === item.id"
      @cancel="cancel"
    />
    <AppPagination :page="page" :page-size="pageSize" :total="total" @change="changePage" />
  </AppPage>
</template>
<style scoped>
.filters {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.filters select,
.filters button {
  padding: var(--space-2) var(--space-3);
}
</style>
