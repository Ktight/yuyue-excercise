<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchAttendances, type Attendance } from '@/features/attendance';
import { fetchClassRecords } from '@/features/class-records/api';

defineProps<{ modelValue?: number; disabled?: boolean }>();
const emit = defineEmits<{
  'update:modelValue': [number | undefined];
  select: [Attendance | null];
}>();

const items = ref<Attendance[]>([]);
const error = ref('');
function change(event: globalThis.Event) {
  const value = (event.target as globalThis.HTMLSelectElement).value;
  const id = value ? Number(value) : undefined;
  emit('update:modelValue', id);
  emit('select', items.value.find((item) => item.id === id) ?? null);
}

onMounted(async () => {
  try {
    const [attendanceResult, recordResult] = await Promise.all([
      fetchAttendances({ pageSize: 100 }),
      fetchClassRecords({ pageSize: 100 }),
    ]);
    const usedAttendanceIds = new Set(
      recordResult.items.flatMap((record) =>
        record.attendanceId === null ? [] : [record.attendanceId],
      ),
    );
    items.value = attendanceResult.items.filter(
      (item) => ['present', 'late'].includes(item.status) && !usedAttendanceIds.has(item.id),
    );
  } catch {
    error.value = '可建档学员加载失败';
  }
});
</script>

<template>
  <label class="attendance-select">
    到课学员
    <select :value="modelValue ?? ''" :disabled="disabled" required @change="change">
      <option value="" disabled>请选择尚未建档的到课学员</option>
      <option v-for="item in items" :key="item.id" :value="item.id">
        {{ item.studentName }} · {{ item.scheduleName }} ·
        {{ item.status === 'late' ? '迟到' : '已到课' }}
      </option>
    </select>
    <small v-if="error" role="alert">{{ error }}</small>
    <small v-else-if="!items.length">暂无符合条件且尚未建档的到课学员</small>
  </label>
</template>

<style scoped>
.attendance-select {
  display: grid;
  gap: var(--space-1);
}
select {
  padding: var(--space-2) var(--space-3);
}
small[role='alert'] {
  color: var(--color-danger);
}
</style>
