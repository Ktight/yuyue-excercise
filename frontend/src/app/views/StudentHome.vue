<script setup lang="ts">
const shortcuts = [
  { title: '我的课程', note: '查看预约与课程安排', to: '/student/bookings' },
  { title: '我的考勤', note: '查看出勤记录与统计', to: '/student/attendance' },
  { title: '课后反馈', note: '查看已经提交的课程感受', to: '/student/feedback' },
  { title: '阶段报告', note: '按日期查看训练成果', to: '/student/reports' },
];
</script>

<template>
  <div class="placeholder-page">
    <div class="pose" aria-hidden="true">ॐ</div>
    <p class="eyebrow">MY YUYUELIAN</p>
    <h1>上午好，学员</h1>
    <p class="lead">坚持练习，遇见更好的自己。</p>
    <nav class="shortcuts" aria-label="学员快捷功能">
      <RouterLink v-for="item in shortcuts" :key="item.to" :to="item.to">
        <strong>{{ item.title }}</strong
        ><small>{{ item.note }}</small
        ><span>查看 →</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-5);
  color: var(--color-text-secondary);
}
.pose {
  display: grid;
  width: 112px;
  height: 112px;
  place-items: center;
  margin-bottom: var(--space-6);
  color: var(--color-brand);
  background: var(--color-brand-light);
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: var(--text-4xl);
}
.eyebrow {
  margin: 0 0 var(--space-2);
  color: var(--color-brand);
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
}
.placeholder-page h1 {
  margin: 0 0 var(--space-2);
  font-size: clamp(var(--text-3xl), 8vw, 3rem);
  color: var(--color-text-primary);
}
.lead {
  margin: 0 0 var(--space-10);
}
.shortcuts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}
.shortcuts a {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-5);
  color: var(--color-text-primary);
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.shortcuts small {
  color: var(--color-text-secondary);
}
.shortcuts span {
  color: var(--color-brand);
}
@media (max-width: 560px) {
  .placeholder-page {
    padding: var(--space-8) var(--space-5);
  }
  .shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
