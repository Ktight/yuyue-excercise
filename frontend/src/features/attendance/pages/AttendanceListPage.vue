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
import { AppPage, AppLoading, AppEmpty, AppError } from '@/app/components';
const auth = useAuthStore(),
  staff = computed(() => auth.userRole !== 'student');
const items = ref<Attendance[]>([]),
  stats = ref<AttendanceStats | null>(null),
  selected = ref<number[]>([]),
  scheduleId = ref<number>(),
  loading = ref(true),
  error = ref(''),
  notice = ref('');
async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = (await fetchAttendances({ scheduleId: scheduleId.value })).items;
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
function choose(id: number, checked: boolean) {
  selected.value = checked
    ? [...new Set([...selected.value, id])]
    : selected.value.filter((v) => v !== id);
}
async function checkIn(id: number) {
  await checkInAttendance(id);
  await load();
}
async function leave(id: number) {
  await markAttendanceLeave(id);
  await load();
}
async function createRows() {
  if (!scheduleId.value) return;
  notice.value = `已创建 ${await autoCreateAttendances(scheduleId.value)} 条考勤记录`;
  await load();
}
async function batch() {
  if (!scheduleId.value || !selected.value.length) return;
  const result = await batchCheckInAttendances(scheduleId.value, selected.value);
  notice.value = `已批量签到 ${result.updatedCount} 人`;
  selected.value = [];
  await load();
}
onMounted(load);
</script>
<template>
  <AppPage :title="staff ? '签到考勤' : '我的考勤'"
    ><form v-if="staff" class="toolbar" @submit.prevent="load">
      <label>排课 ID<input v-model.number="scheduleId" type="number" min="1" required /></label
      ><button>查询</button><button type="button" @click="createRows">自动建档</button
      ><button type="button" :disabled="!selected.length" @click="batch">批量签到</button>
    </form>
    <p v-if="notice">{{ notice }}</p>
    <AttendanceStatsCard :stats="stats" /><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><AppEmpty
      v-else-if="!items.length"
      description="暂无考勤记录" /><AttendanceCard
      v-for="item in items"
      v-else
      :key="item.id"
      :attendance="item"
      :staff="staff"
      :selected="selected.includes(item.studentId)"
      @select="choose"
      @check-in="checkIn"
      @leave="leave"
  /></AppPage>
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
</style>
