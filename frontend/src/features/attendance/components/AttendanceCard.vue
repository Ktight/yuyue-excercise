<script setup lang="ts">
import type { Attendance } from '@/features/attendance/model';
withDefaults(
  defineProps<{
    attendance: Attendance;
    staff?: boolean;
    selected?: boolean;
    disabled?: boolean;
  }>(),
  { staff: false, selected: false, disabled: false },
);
defineEmits<{ checkIn: [number]; leave: [number]; select: [number, boolean] }>();
const labels = { present: '已到', late: '迟到', absent: '缺席', leave: '请假' };
</script>
<template>
  <article class="card">
    <input
      v-if="staff"
      type="checkbox"
      :checked="selected"
      :disabled="disabled"
      :aria-label="`选择 ${attendance.studentName}`"
      @change="$emit('select', attendance.studentId, ($event.target as HTMLInputElement).checked)"
    />
    <div class="main">
      <strong>{{ attendance.studentName }}</strong>
      <p>{{ attendance.scheduleName }}</p>
      <small>{{
        attendance.checkInTime ? new Date(attendance.checkInTime).toLocaleString() : '尚未签到'
      }}</small>
    </div>
    <span>{{ labels[attendance.status] }}</span>
    <div class="actions">
      <button
        v-if="attendance.status === 'absent'"
        :disabled="disabled"
        @click="$emit('checkIn', attendance.id)"
      >
        签到</button
      ><button
        v-if="staff && attendance.status === 'absent'"
        :disabled="disabled"
        @click="$emit('leave', attendance.id)"
      >
        请假
      </button>
    </div>
  </article>
</template>
<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.main {
  display: grid;
  flex: 1;
  gap: var(--space-1);
}
p,
small {
  margin: 0;
  color: var(--color-text-secondary);
}
.actions {
  display: flex;
  gap: var(--space-2);
}
button {
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
}
</style>
