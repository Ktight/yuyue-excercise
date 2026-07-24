<script setup lang="ts">
import { computed, ref } from 'vue';
import { AccountActions } from '@/layouts/components';
import { sessionSummary } from '@/shared/session';

const sidebarOpen = ref(false);

const allNavItems = [
  { label: '首页', key: 'dashboard', to: '/admin' },
  {
    label: '用户管理',
    key: 'users',
    to: '/admin/users',
    roles: ['super_admin', 'company_admin'],
  },
  {
    label: '公司管理',
    key: 'companies',
    to: '/admin/companies',
    roles: ['super_admin', 'company_admin'],
  },
  { label: '门店管理', key: 'stores', to: '/admin/stores' },
  { label: '课程模板', key: 'course-templates', to: '/admin/course-templates' },
  { label: '排课管理', key: 'scheduling', to: '/admin/schedules' },
  { label: '预约管理', key: 'bookings', to: '/admin/bookings' },
  { label: '签到考勤', key: 'attendance', to: '/admin/attendance' },
  { label: '课堂档案模板', key: 'class-templates', to: '/admin/class-templates' },
  { label: '课时档案', key: 'class-records', to: '/admin/class-records' },
  { label: '训练计划', key: 'training-plans', to: '/admin/training-plans' },
  { label: '阶段报告', key: 'reports', to: '/admin/reports' },
  { label: '数据看板', key: 'analytics', to: '/admin/analytics' },
  { label: '提醒中心', key: 'reminders', to: '/admin/reminders' },
];
const navItems = computed(() =>
  allNavItems.filter(
    (item) =>
      !item.roles ||
      (sessionSummary.value?.role ? item.roles.includes(sessionSummary.value.role) : false),
  ),
);
</script>

<template>
  <div class="admin-layout">
    <button
      class="admin-layout__menu-btn"
      aria-label="切换菜单"
      @click="sidebarOpen = !sidebarOpen"
    >
      <span class="admin-layout__menu-icon" />
    </button>

    <aside class="admin-layout__sidebar" :class="{ 'is-open': sidebarOpen }">
      <div class="admin-layout__brand">瑜悦练 · 管理</div>
      <nav class="admin-layout__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          class="admin-layout__nav-item"
          :to="item.to"
          @click="sidebarOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="admin-layout__main">
      <header class="admin-layout__header">
        <h2 class="admin-layout__title">管理后台</h2>
        <div class="admin-layout__user-area">
          <slot name="header-extra" />
          <AccountActions />
        </div>
      </header>
      <div class="admin-layout__content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #fbfaf8;
}

.admin-layout__menu-btn {
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

.admin-layout__menu-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text-primary);
  position: relative;
}

.admin-layout__menu-icon::before,
.admin-layout__menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-text-primary);
}

.admin-layout__menu-icon::before {
  top: -6px;
}

.admin-layout__menu-icon::after {
  top: 6px;
}

.admin-layout__sidebar {
  position: sticky;
  top: 0;
  width: 184px;
  height: 100vh;
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-5) 0;
}

.admin-layout__brand {
  padding: var(--space-1) var(--space-5) var(--space-6);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-brand);
  border-bottom: 0;
  margin-bottom: var(--space-2);
}

.admin-layout__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: 0 var(--space-3);
}

.admin-layout__nav-item {
  display: block;
  padding: 0.7rem var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.admin-layout__nav-item:hover {
  background: var(--color-brand-light);
  color: var(--color-brand);
}
.admin-layout__nav-item.router-link-active {
  background: linear-gradient(90deg, var(--color-brand-light), #fffaf6);
  color: var(--color-brand);
  font-weight: var(--font-semibold);
}
.admin-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-layout__header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
  padding: var(--space-3) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.admin-layout__title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.admin-layout__content {
  flex: 1;
  padding: 0 var(--space-5);
  width: 100%;
  max-width: none;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .admin-layout__menu-btn {
    display: flex;
  }

  .admin-layout__sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: var(--z-sticky);
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
  }

  .admin-layout__sidebar.is-open {
    transform: translateX(0);
  }

  .admin-layout__header {
    padding-left: calc(var(--space-6) + 44px);
  }

  .admin-layout__content {
    padding: 0;
  }
}
</style>
