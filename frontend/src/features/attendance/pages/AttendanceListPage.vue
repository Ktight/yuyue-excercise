<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  autoCreateAttendances,
  batchCheckInAttendances,
  checkInAttendance,
  fetchAttendances,
  fetchAttendanceStats,
  markAttendanceLeave,
} from '@/features/attendance/api';
import type { Attendance, AttendanceStats } from '@/features/attendance/model';
import { AttendanceCard, AttendanceStatsCard } from '@/features/attendance/components';
import { useAuthStore } from '@/features/auth';
import { ScheduleSelect } from '@/features/schedules';
import { AppPage, AppLoading, AppEmpty, AppError, AppPagination } from '@/app/components';
import { getErrorMessage } from '@/shared/api';
const auth = useAuthStore(),
  staff = computed(() => auth.userRole !== 'student');
const items = ref<Attendance[]>([]),
  stats = ref<AttendanceStats | null>(null),
  selected = ref<number[]>([]),
  scheduleId = ref<number>(),
  loading = ref(true),
  error = ref(''),
  notice = ref(''),
  actionError = ref(''),
  pendingAction = ref(''),
  page = ref(1),
  total = ref(0);
const pageSize = 20;
async function load() {
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchAttendances({
      page: page.value,
      pageSize,
      scheduleId: scheduleId.value,
    });
    items.value = result.items;
    total.value = result.total;
    if (auth.userRole === 'student' && auth.user?.id)
      stats.value = await fetchAttendanceStats({ studentId: auth.user.id });
    else if (scheduleId.value)
      stats.value = await fetchAttendanceStats({ scheduleId: scheduleId.value });
  } catch {
    error.value = '考勤加载失败';
  } finally {
    loading.value = false;
  }
}
function applyFilter() {
  page.value = 1;
  void load();
}
function changePage(value: number) {
  page.value = value;
  void load();
}
function choose(id: number, checked: boolean) {
  selected.value = checked
    ? [...new Set([...selected.value, id])]
    : selected.value.filter((v) => v !== id);
}
async function checkIn(id: number) {
  await runAction(`check-in-${id}`, async () => {
    await checkInAttendance(id);
    notice.value = '签到成功';
    await load();
  });
}
async function leave(id: number) {
  await runAction(`leave-${id}`, async () => {
    await markAttendanceLeave(id);
    notice.value = '已标记请假';
    await load();
  });
}
async function createRows() {
  const targetScheduleId = scheduleId.value;
  if (!targetScheduleId) return;
  await runAction('auto-create', async () => {
    notice.value = `已创建 ${await autoCreateAttendances(targetScheduleId)} 条考勤记录`;
    await load();
  });
}
async function batch() {
  const targetScheduleId = scheduleId.value;
  if (!targetScheduleId || !selected.value.length) return;
  await runAction('batch', async () => {
    const result = await batchCheckInAttendances(targetScheduleId, selected.value);
    notice.value = `已批量签到 ${result.updatedCount} 人`;
    selected.value = [];
    await load();
  });
}
async function runAction(key: string, action: () => Promise<void>) {
  if (pendingAction.value) return;
  pendingAction.value = key;
  actionError.value = '';
  notice.value = '';
  try {
    await action();
  } catch (cause) {
    actionError.value = getErrorMessage(cause, '操作失败，请稍后重试');
  } finally {
    pendingAction.value = '';
  }
}
onMounted(load);
</script>
<template>
  <AppPage :title="staff ? '签到考勤' : '我的考勤'"
    ><form v-if="staff" class="toolbar" @submit.prevent="applyFilter">
      <ScheduleSelect v-model="scheduleId" :disabled="Boolean(pendingAction)" />
      ><button :disabled="Boolean(pendingAction)">查询</button
      ><button type="button" :disabled="Boolean(pendingAction)" @click="createRows">
        {{ pendingAction === 'auto-create' ? '创建中…' : '自动建档' }}</button
      ><button type="button" :disabled="!selected.length || Boolean(pendingAction)" @click="batch">
        {{ pendingAction === 'batch' ? '签到中…' : '批量签到' }}
      </button>
    </form>
    <p v-if="notice">{{ notice }}</p>
    <p v-if="actionError" class="action-error" role="alert">{{ actionError }}</p>
    <AttendanceStatsCard :stats="stats" /><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load"
    /><AppEmpty v-else-if="!items.length" description="暂无考勤记录" /><AttendanceCard
      v-for="item in items"
      v-else
      :key="item.id"
      :attendance="item"
      :staff="staff"
      :selected="selected.includes(item.studentId)"
      :disabled="Boolean(pendingAction)"
      @select="choose"
      @check-in="checkIn"
      @leave="leave"
    />
    <AppPagination :page="page" :page-size="pageSize" :total="total" @change="changePage" />
  </AppPage>
</template>
<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: end;
  margin-bottom: var(--space-4);
}
label {
  display: grid;
  gap: var(--space-1);
}
input,
button {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
}
.action-error {
  color: var(--color-danger);
}
</style>
