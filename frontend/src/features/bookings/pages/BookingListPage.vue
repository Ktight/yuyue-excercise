<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { cancelBooking, fetchBookings } from '@/features/bookings/api';
import type { Booking } from '@/features/bookings/model';
import { BookingCard } from '@/features/bookings/components';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';
import { getErrorMessage } from '@/shared/api';
const items = ref<Booking[]>([]),
  loading = ref(true),
  error = ref(''),
  actionError = ref(''),
  cancellingId = ref<number | null>(null);
async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = (await fetchBookings()).items;
  } catch {
    error.value = '预约加载失败';
  } finally {
    loading.value = false;
  }
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
    ><p v-if="actionError" role="alert">{{ actionError }}</p>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><AppEmpty v-else-if="!items.length" description="暂无预约" /><BookingCard
      v-for="item in items"
      v-else
      :key="item.id"
      :booking="item"
      :cancelling="cancellingId === item.id"
      @cancel="cancel"
  /></AppPage>
</template>
