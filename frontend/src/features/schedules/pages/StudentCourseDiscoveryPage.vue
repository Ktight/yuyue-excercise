<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppEmpty, AppError, AppLoading, AppPage } from '@/app/components';
import { bookSchedule } from '@/features/bookings';
import { fetchSchedules } from '@/features/schedules/api';
import type { Schedule } from '@/features/schedules/model';
import { getErrorMessage } from '@/shared/api';
const items = ref<Schedule[]>([]),
  loading = ref(true),
  error = ref(''),
  notice = ref(''),
  bookingId = ref<number | null>(null);
async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = (
      await fetchSchedules({
        status: 'published',
        pageSize: 100,
        dateFrom: new Date().toISOString().slice(0, 10),
      })
    ).items;
  } catch {
    error.value = '可预约课程加载失败；真实接口尚未就绪时请启用演示 Mock。';
  } finally {
    loading.value = false;
  }
}
async function book(item: Schedule) {
  if (bookingId.value !== null || !globalThis.confirm(`确认预约“${item.courseTemplateName}”？`))
    return;
  bookingId.value = item.id;
  error.value = '';
  notice.value = '';
  try {
    await bookSchedule(item.id);
    notice.value = `已预约 ${item.courseTemplateName}`;
  } catch (cause) {
    error.value = getErrorMessage(cause, '预约失败，请检查会员资格、容量或时间冲突');
  } finally {
    bookingId.value = null;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="发现课程"
    ><p class="intro">选择适合你的近期课程；预约结果可在“我的预约”中查看。</p>
    <p v-if="notice" role="status">{{ notice }}</p>
    <AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    /><AppEmpty v-else-if="!items.length" description="暂时没有可预约课程" />
    <section v-else class="course-grid">
      <article v-for="item in items" :key="item.id" class="course-card">
        <span class="course-card__date"
          >{{ item.courseDate }} · {{ item.startTime.slice(0, 5) }}</span
        >
        <h2>{{ item.courseTemplateName }}</h2>
        <p>{{ item.trainerName }} · {{ item.roomName }}</p>
        <p>
          剩余 {{ Math.max(0, item.capacity - item.bookingsCount) }} / {{ item.capacity }} 个名额
        </p>
        <button
          :disabled="bookingId !== null || item.bookingsCount >= item.capacity"
          @click="book(item)"
        >
          {{
            bookingId === item.id
              ? '预约中…'
              : item.bookingsCount >= item.capacity
                ? '已满员'
                : '立即预约'
          }}
        </button>
      </article>
    </section></AppPage
  >
</template>
<style scoped>
.intro {
  color: var(--color-text-secondary);
}
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}
.course-card {
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.course-card h2 {
  margin: var(--space-3) 0;
}
.course-card p {
  color: var(--color-text-secondary);
}
.course-card__date {
  color: var(--color-brand);
  font-weight: var(--font-semibold);
}
.course-card button {
  width: 100%;
  padding: var(--space-3);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
</style>
