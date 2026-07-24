<script setup lang="ts">
import { computed } from 'vue';
import { AppCard } from '@/app/components';
import type { StudentHomeSummary } from '../model';

const props = defineProps<{ summary: StudentHomeSummary }>();

const formattedNextClass = computed(() =>
  props.summary.nextClass
    ? new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(props.summary.nextClass.startAt))
    : '',
);

const metrics = computed(() => [
  { label: '已完成课时', value: props.summary.completedSessions, unit: '节' },
  {
    label: '出勤率',
    value: Math.round(props.summary.attendanceRate * 100),
    unit: '%',
  },
  { label: '连续练习', value: props.summary.currentStreakDays, unit: '天' },
  { label: '进行中计划', value: props.summary.activePlanCount, unit: '个' },
]);
</script>

<template>
  <div class="student-home-dashboard">
    <section class="hero">
      <p class="hero__eyebrow">MY YUYUELIAN</p>
      <h1>你好，{{ summary.studentName }}</h1>
      <p>保持耐心，也保持热爱。每一次练习都算数。</p>
    </section>

    <section class="metrics" aria-label="训练概览">
      <AppCard v-for="metric in metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong
          >{{ metric.value }}<small>{{ metric.unit }}</small></strong
        >
      </AppCard>
    </section>

    <section class="overview">
      <AppCard class="next-class">
        <p class="section-label">下一节课</p>
        <template v-if="summary.nextClass">
          <h2>{{ summary.nextClass.courseName }}</h2>
          <p class="accent">{{ formattedNextClass }}</p>
          <p>{{ summary.nextClass.trainerName }} · {{ summary.nextClass.roomName }}</p>
          <RouterLink to="/student/bookings">查看预约详情 →</RouterLink>
        </template>
        <template v-else>
          <h2>还没有预约课程</h2>
          <p>从适合自己的课程开始下一次练习。</p>
          <RouterLink to="/student/courses">发现课程 →</RouterLink>
        </template>
      </AppCard>

      <AppCard class="active-plan">
        <p class="section-label">当前训练计划</p>
        <template v-if="summary.activePlan">
          <h2>{{ summary.activePlan.title }}</h2>
          <div class="progress" :aria-label="`计划进度 ${summary.activePlan.progressPercentage}%`">
            <span :style="{ width: `${summary.activePlan.progressPercentage}%` }" />
          </div>
          <p>
            已完成 {{ summary.activePlan.completedSessionsCount }} 节 ·
            {{ summary.activePlan.progressPercentage }}%
          </p>
          <RouterLink :to="`/student/plans/${summary.activePlan.id}`">查看计划 →</RouterLink>
        </template>
        <template v-else>
          <h2>暂无进行中的计划</h2>
          <p>可以联系教练共同制定阶段目标。</p>
          <RouterLink to="/student/plans">查看全部计划 →</RouterLink>
        </template>
      </AppCard>
    </section>

    <AppCard v-if="summary.recentRecord" class="recent-record">
      <div>
        <p class="section-label">最近训练记录</p>
        <h2>{{ summary.recentRecord.theme }}</h2>
        <p>
          {{ summary.recentRecord.classDate }} · {{ summary.recentRecord.trainerName }} · 第
          {{ summary.recentRecord.sessionNumber }} 节
        </p>
      </div>
      <RouterLink :to="`/student/history/${summary.recentRecord.id}`">查看记录 →</RouterLink>
    </AppCard>

    <nav class="shortcuts" aria-label="学员快捷功能">
      <RouterLink to="/student/courses">发现课程</RouterLink>
      <RouterLink to="/student/history">训练历史</RouterLink>
      <RouterLink to="/student/feedback">我的反馈</RouterLink>
      <RouterLink to="/student/reports">阶段报告</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.student-home-dashboard {
  display: grid;
  gap: var(--space-5);
}
.hero {
  padding: var(--space-8);
  color: var(--color-text-inverse);
  background:
    radial-gradient(circle at 88% 20%, rgba(255, 255, 255, 0.24), transparent 28%),
    linear-gradient(135deg, var(--color-primary-700), var(--color-primary-400));
  border-radius: var(--radius-2xl);
}
.hero__eyebrow,
.section-label {
  margin: 0 0 var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.hero h1 {
  margin: 0;
  font-size: clamp(var(--text-3xl), 5vw, 2.75rem);
}
.hero p:last-child {
  margin-bottom: 0;
  opacity: 0.88;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-3);
}
.metrics article {
  display: grid;
  gap: var(--space-2);
}
.metrics span {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}
.metrics strong {
  font-size: var(--text-2xl);
}
.metrics small {
  margin-left: 3px;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
}
.overview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}
.overview h2,
.recent-record h2 {
  margin: 0 0 var(--space-2);
}
.section-label {
  color: var(--color-brand);
}
.overview p,
.recent-record p {
  color: var(--color-text-secondary);
}
.overview a,
.recent-record a {
  color: var(--color-brand);
  font-weight: var(--font-semibold);
  text-decoration: none;
}
.accent {
  color: var(--color-brand) !important;
  font-weight: var(--font-semibold);
}
.progress {
  height: 8px;
  margin: var(--space-4) 0;
  overflow: hidden;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
}
.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand), var(--color-accent));
}
.recent-record {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}
.shortcuts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-3);
}
.shortcuts a {
  padding: var(--space-4);
  color: var(--color-text-primary);
  text-align: center;
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
@media (max-width: 720px) {
  .metrics,
  .shortcuts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .overview {
    grid-template-columns: 1fr;
  }
  .hero {
    padding: var(--space-6);
    border-radius: 0;
  }
  .recent-record {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
