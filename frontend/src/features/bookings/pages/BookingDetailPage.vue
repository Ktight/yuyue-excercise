<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppError, AppLoading, AppPage, AppStatusTag, confirmAction } from '@/app/components';
import { cancelBooking, fetchBooking } from '../api';
import type { Booking } from '../model';
const route = useRoute(),
  router = useRouter(),
  item = ref<Booking | null>(null),
  loading = ref(true),
  error = ref(''),
  busy = ref(false);
const id = computed(() => Number(route.params.id));
async function load() {
  loading.value = true;
  error.value = '';
  try {
    item.value = await fetchBooking(id.value);
  } catch {
    error.value = '预约详情加载失败';
  } finally {
    loading.value = false;
  }
}
async function cancel() {
  if (
    !item.value ||
    busy.value ||
    !(await confirmAction({
      title: '取消预约',
      message: '取消后名额将被释放。',
      confirmText: '确认取消',
      danger: true,
    }))
  )
    return;
  busy.value = true;
  try {
    item.value = await cancelBooking(item.value.id);
  } catch {
    error.value = '取消预约失败';
  } finally {
    busy.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage title="预约详情"
    ><template #header-extra><button @click="router.back()">返回</button></template
    ><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    />
    <article v-else-if="item" class="detail">
      <header>
        <div>
          <p>预约编号 #{{ item.id }}</p>
          <h2>{{ item.schedule.courseTemplateName }}</h2>
        </div>
        <AppStatusTag
          :status="item.status"
          :label="item.status === 'booked' ? '已预约' : '已取消'"
        />
      </header>
      <dl>
        <div>
          <dt>学员</dt>
          <dd>{{ item.student.name }} · {{ item.student.phone }}</dd>
        </div>
        <div>
          <dt>日期</dt>
          <dd>{{ item.schedule.courseDate }}</dd>
        </div>
        <div>
          <dt>时间</dt>
          <dd>{{ item.schedule.startTime.slice(0, 5) }}–{{ item.schedule.endTime.slice(0, 5) }}</dd>
        </div>
        <div>
          <dt>教练</dt>
          <dd>{{ item.schedule.trainerName }}</dd>
        </div>
        <div>
          <dt>教室</dt>
          <dd>{{ item.schedule.roomName }}</dd>
        </div>
        <div>
          <dt>预约时间</dt>
          <dd>{{ new Date(item.bookingTime).toLocaleString('zh-CN') }}</dd>
        </div>
      </dl>
      <button v-if="item.status === 'booked'" class="danger" :disabled="busy" @click="cancel">
        {{ busy ? '取消中…' : '取消预约' }}
      </button>
    </article></AppPage
  >
</template>
<style scoped>
.detail {
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}
header p {
  margin: 0;
  color: var(--color-text-secondary);
}
h2 {
  margin: var(--space-1) 0 0;
}
dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
  margin: var(--space-6) 0;
}
dt {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}
dd {
  margin: var(--space-1) 0 0;
}
.danger {
  padding: var(--space-2) var(--space-4);
  color: var(--color-danger);
  background: none;
  border: 1px solid currentColor;
  border-radius: var(--radius-button);
}
@media (max-width: 600px) {
  dl {
    grid-template-columns: 1fr;
  }
}
</style>
