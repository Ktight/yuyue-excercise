<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deleteSchedule, fetchSchedule, updateSchedule } from '@/features/schedules/api';
import type { Schedule, ScheduleWriteInput } from '@/features/schedules/model';
import { ScheduleForm } from '@/features/schedules/components';
import { bookSchedule, ProxyBookingForm } from '@/features/bookings';
import { AppPage, AppLoading, AppError, confirmAction } from '@/app/components';
import { getErrorMessage } from '@/shared/api';
const route = useRoute(),
  router = useRouter();
const id = Number(route.params.id),
  item = ref<Schedule | null>(null),
  loading = ref(true),
  error = ref(''),
  notice = ref(''),
  actionError = ref(''),
  deleting = ref(false);
async function load() {
  try {
    item.value = await fetchSchedule(id);
  } catch {
    error.value = '排课不存在或无权访问';
  } finally {
    loading.value = false;
  }
}
async function save(v: ScheduleWriteInput) {
  item.value = await updateSchedule(id, v);
  notice.value = '排课已更新';
}
async function book(studentId: number) {
  await bookSchedule(id, studentId);
  notice.value = '代预约成功';
  await load();
}
async function remove() {
  if (
    deleting.value ||
    !(await confirmAction({
      title: '删除排课',
      message: '删除可能影响已有预约和考勤，请确认已处理相关学员。',
      confirmText: '确认删除',
      danger: true,
    }))
  )
    return;
  deleting.value = true;
  actionError.value = '';
  try {
    await deleteSchedule(id);
    await router.push(
      route.path.startsWith('/trainer') ? '/trainer/schedules' : '/admin/schedules',
    );
  } catch (cause) {
    actionError.value = getErrorMessage(cause, '删除排课失败，请稍后重试');
  } finally {
    deleting.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage :title="item?.courseTemplateName || '排课详情'"
    ><AppLoading v-if="loading" /><AppError v-else-if="error" :message="error" /><template
      v-else-if="item"
      ><p>
        {{ item.courseDate }} {{ item.startTime.slice(0, 5) }} · 已预约 {{ item.bookingsCount }}/{{
          item.capacity
        }}
      </p>
      <p v-if="notice">{{ notice }}</p>
      <p v-if="actionError" class="danger" role="alert">{{ actionError }}</p>
      <ProxyBookingForm :schedule-id="item.id" :on-submit="book" />
      <button class="danger" :disabled="deleting" @click="remove">
        {{ deleting ? '删除中…' : '删除排课' }}</button
      ><ScheduleForm :initial="item" :on-submit="save" /></template
  ></AppPage>
</template>
<style scoped>
.danger {
  padding: var(--space-2) var(--space-4);
  margin: var(--space-3) 0;
  color: var(--color-danger);
  background: none;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-button);
}
</style>
