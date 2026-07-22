<script setup lang="ts">
const shortcuts = [
  { title: '我的学员', note: '档案、会员与身体评估', to: '/trainer/students' },
  { title: '课程安排', note: '查看并维护我的排课', to: '/trainer/schedules' },
  { title: '签到考勤', note: '处理本节课程出勤', to: '/trainer/attendance' },
];
</script>

<template>
  <div class="placeholder-page">
    <div class="hero-art" aria-hidden="true"><span>瑜</span></div>
    <p class="eyebrow">TRAINER STUDIO</p>
    <h1>上午好，教练</h1>
    <p class="lead">专注教学，用心陪伴每一次成长。</p>
    <nav class="shortcuts" aria-label="训练师快捷功能">
      <RouterLink v-for="item in shortcuts" :key="item.to" :to="item.to">
        <strong>{{ item.title }}</strong
        ><small>{{ item.note }}</small
        ><span>进入 →</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 880px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-5);
  color: var(--color-text-secondary);
}
.eyebrow {
  margin: 0 0 var(--space-2);
  color: var(--color-brand);
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
}
.placeholder-page h1 {
  margin: 0 0 var(--space-2);
  font-size: clamp(var(--text-3xl), 7vw, 3.25rem);
  color: var(--color-text-primary);
}
.lead {
  margin: 0 0 var(--space-10);
}
.hero-art {
  display: grid;
  width: 120px;
  height: 120px;
  place-items: center;
  margin-bottom: var(--space-6);
  color: var(--color-brand);
  background: radial-gradient(circle, var(--color-primary-100), transparent 70%);
  border: 1px solid var(--color-primary-100);
  border-radius: 50%;
}
.hero-art span {
  font-family: Georgia, serif;
  font-size: var(--text-4xl);
}
.shortcuts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  font-size: var(--text-sm);
}
@media (max-width: 640px) {
  .placeholder-page {
    padding: var(--space-8) var(--space-5);
  }
  .hero-art {
    width: 96px;
    height: 96px;
  }
  .shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
