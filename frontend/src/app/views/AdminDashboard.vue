<script setup lang="ts">
const shortcuts = [
  { title: '学员管理', description: '维护档案、会员与身体评估', to: '/admin/students', mark: '学' },
  { title: '排课管理', description: '创建单次或周期课程', to: '/admin/schedules', mark: '课' },
  { title: '预约管理', description: '查看预约并处理取消', to: '/admin/bookings', mark: '约' },
  { title: '签到考勤', description: '自动建档、签到与统计', to: '/admin/attendance', mark: '勤' },
];
</script>

<template>
  <div class="placeholder-page">
    <div class="hero">
      <p class="eyebrow">YUYUELIAN MANAGEMENT</p>
      <h1>管理工作台</h1>
      <p>把门店、课程、学员与服务记录集中在一个清晰的工作空间。</p>
    </div>
    <section class="shortcut-grid" aria-label="快捷功能">
      <RouterLink v-for="item in shortcuts" :key="item.to" class="shortcut" :to="item.to">
        <span class="shortcut__mark">{{ item.mark }}</span>
        <span
          ><strong>{{ item.title }}</strong
          ><small>{{ item.description }}</small></span
        >
        <span class="shortcut__arrow">→</span>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-8) var(--space-5);
  color: var(--color-text-secondary);
}
.hero {
  max-width: 720px;
  padding: var(--space-8) 0 var(--space-10);
}
.eyebrow {
  margin: 0 0 var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.16em;
  color: var(--color-brand);
}
.hero h1 {
  margin: 0 0 var(--space-3);
  font-size: clamp(var(--text-3xl), 5vw, 3.5rem);
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
}
.hero p:last-child {
  margin: 0;
  font-size: var(--text-lg);
}
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}
.shortcut {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-3);
  min-height: 132px;
  padding: var(--space-5);
  color: var(--color-text-primary);
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xs);
}
.shortcut:hover {
  border-color: var(--color-primary-200);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.shortcut__mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: var(--color-brand);
  background: var(--color-brand-light);
  border-radius: var(--radius-md);
}
.shortcut strong,
.shortcut small {
  display: block;
}
.shortcut small {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
}
.shortcut__arrow {
  color: var(--color-brand);
}
@media (max-width: 1000px) {
  .shortcut-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .placeholder-page {
    padding: var(--space-5) 0;
  }
  .hero {
    padding-top: var(--space-4);
  }
  .shortcut-grid {
    grid-template-columns: 1fr;
  }
}
</style>
