<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { cancelBooking, fetchBookings } from '@/features/bookings/api';
import type { Booking } from '@/features/bookings/model';
import { BookingCard } from '@/features/bookings/components';
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';
const items = ref<Booking[]>([]),
  loading = ref(true),
  error = ref('');
async function load() {
  loading.value = true;
  try {
    items.value = (await fetchBookings()).items;
  } catch {
    error.value = '预约加载失败';
  } finally {
    loading.value = false;
  }
}
async function cancel(id: number) {
  if (!globalThis.confirm('确认取消这条预约？')) return;
  await cancelBooking(id);
  await load();
}
onMounted(load);
</script>
<template>
  <AppPage title="预约记录"
    ><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><AppEmpty v-else-if="!items.length" description="暂无预约" /><BookingCard
      v-for="item in items"
      v-else
      :key="item.id"
      :booking="item"
      @cancel="cancel"
  /></AppPage>
</template>
