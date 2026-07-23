<script setup lang="ts">
import { ref } from 'vue';
import { AccountActions } from '@/layouts/components';

const sidebarOpen = ref(false);

const navItems = [
  { label: '首页', key: 'dashboard', to: '/trainer' },
  { label: '学员管理', key: 'students', to: '/trainer/students' },
  { label: '课程安排', key: 'schedule', to: '/trainer/schedules' },
  { label: '课程模板', key: 'course-templates', to: '/trainer/course-templates' },
  { label: '预约管理', key: 'bookings', to: '/trainer/bookings' },
  { label: '签到考勤', key: 'attendance', to: '/trainer/attendance' },
  { label: '课堂档案模板', key: 'class-templates', to: '/trainer/class-templates' },
  { label: '课时档案', key: 'records', to: '/trainer/class-records' },
  { label: '训练规划', key: 'plans' },
];

const mobileNavItems = [
  { label: '首页', key: 'home', icon: '⌂', to: '/trainer' },
  { label: '学员', key: 'students', icon: '♙', to: '/trainer/students' },
  { label: '课程', key: 'courses', icon: '□', to: '/trainer/schedules' },
  { label: '我的', key: 'profile', icon: '○' },
];
</script>

<template>
  <div class="trainer-layout">
    <button
      class="trainer-layout__menu-btn"
      aria-label="切换菜单"
      @click="sidebarOpen = !sidebarOpen"
    >
      <span class="trainer-layout__menu-icon" />
    </button>

    <aside class="trainer-layout__sidebar" :class="{ 'is-open': sidebarOpen }">
      <div class="trainer-layout__brand">瑜悦练 · 训练师</div>
      <nav class="trainer-layout__nav">
        <template v-for="item in navItems" :key="item.key">
          <RouterLink
            v-if="item.to"
            class="trainer-layout__nav-item"
            :to="item.to"
            @click="sidebarOpen = false"
          >
            {{ item.label }}
          </RouterLink>
          <span v-else class="trainer-layout__nav-item is-disabled">
            {{ item.label }} · 待开发
          </span>
        </template>
      </nav>
    </aside>

    <div class="trainer-layout__main">
      <header class="trainer-layout__header">
        <h2 class="trainer-layout__title">训练师工作台</h2>
        <div class="trainer-layout__user-area">
          <slot name="header-extra" />
          <AccountActions />
        </div>
      </header>
      <div class="trainer-layout__content">
        <RouterView />
      </div>
    </div>

    <nav class="trainer-layout__mobile-nav" aria-label="训练师主导航">
      <template v-for="item in mobileNavItems" :key="item.key">
        <RouterLink v-if="item.to" class="trainer-layout__mobile-item" :to="item.to">
          <span class="trainer-layout__mobile-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
        <span v-else class="trainer-layout__mobile-item is-disabled">
          <span class="trainer-layout__mobile-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </span>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.trainer-layout {
  display: flex;
  min-height: 100vh;
  background: #fbfaf8;
}

.trainer-layout__menu-btn {
  display: none;
  position: fixed;
  top: var(--space-3);
  left: var(--space-3);
  z-index: var(--z-overlay);
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.trainer-layout__menu-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text-primary);
  position: relative;
}

.trainer-layout__menu-icon::before,
.trainer-layout__menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-text-primary);
}

.trainer-layout__menu-icon::before {
  top: -6px;
}

.trainer-layout__menu-icon::after {
  top: 6px;
}

.trainer-layout__sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-6) 0;
  box-shadow: none;
}

.trainer-layout__brand {
  padding: 0 var(--space-6) var(--space-6);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-brand);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-4);
}

.trainer-layout__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: 0 var(--space-3);
}

.trainer-layout__nav-item {
  display: block;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.trainer-layout__nav-item:hover {
  background: var(--color-brand-light);
  color: var(--color-text-primary);
}
.trainer-layout__nav-item.router-link-active {
  color: var(--color-brand);
  background: linear-gradient(90deg, var(--color-brand-light), #fffaf6);
  font-weight: var(--font-semibold);
}
.trainer-layout__nav-item.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.trainer-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.trainer-layout__header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.trainer-layout__title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.trainer-layout__content {
  flex: 1;
  padding: var(--space-6);
}

.trainer-layout__mobile-nav {
  display: none;
}

@media (max-width: 768px) {
  .trainer-layout__menu-btn {
    display: none;
  }

  .trainer-layout__sidebar {
    display: none;
  }

  .trainer-layout__header {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    padding: var(--space-3) var(--space-5);
  }

  .trainer-layout__content {
    width: 100%;
    max-width: var(--mobile-content-max-width);
    margin: 0 auto;
    padding: 0 0 calc(76px + var(--safe-area-inset-bottom));
  }

  .trainer-layout__mobile-nav {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--z-sticky);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: var(--space-2) max(var(--space-3), var(--safe-area-inset-right))
      calc(var(--space-2) + var(--safe-area-inset-bottom))
      max(var(--space-3), var(--safe-area-inset-left));
    background: rgba(255, 255, 255, 0.94);
    border-top: 1px solid var(--color-border-light);
    backdrop-filter: blur(18px);
    box-shadow: 0 -8px 24px rgba(62, 43, 28, 0.06);
  }

  .trainer-layout__mobile-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: var(--space-1);
    color: var(--color-text-secondary);
    font-size: var(--text-xs);
    text-decoration: none;
  }

  .trainer-layout__mobile-icon {
    font-size: var(--text-xl);
    line-height: 1;
  }

  .trainer-layout__mobile-item.router-link-active {
    color: var(--color-brand);
    font-weight: var(--font-semibold);
  }

  .trainer-layout__mobile-item.is-disabled {
    opacity: 0.45;
  }
}
</style>
