<script setup lang="ts">
import type { AttendanceStats } from '@/features/attendance/model';
defineProps<{ stats: AttendanceStats | null }>();
</script>
<template>
  <section v-if="stats" class="stats">
    <div v-if="stats.studentStats">
      <strong>个人出勤率 {{ stats.studentStats.attendanceRate }}%</strong
      ><span>出勤 {{ stats.studentStats.attendedCount }}/{{ stats.studentStats.totalCount }}</span
      ><span
        >迟到 {{ stats.studentStats.lateCount }} · 请假 {{ stats.studentStats.leaveCount }} ·
        连续出勤 {{ stats.studentStats.consecutiveAttendance }}</span
      >
    </div>
    <div v-if="stats.courseStats">
      <strong>课程出勤率 {{ stats.courseStats.attendanceRate }}%</strong
      ><span>到课 {{ stats.courseStats.arrivedCount }}/{{ stats.courseStats.bookingCount }}</span>
    </div>
  </section>
</template>
<style scoped>
.stats {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xs);
}
.stats strong {
  color: var(--color-brand);
}
.stats div {
  display: grid;
  gap: var(--space-1);
}
</style>
