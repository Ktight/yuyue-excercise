<script setup lang="ts">
import { ref } from 'vue';

const sidebarOpen = ref(false);

const navItems = [
  { label: '首页', key: 'dashboard', to: '/admin' },
  { label: '用户管理', key: 'users', to: '/admin/users' },
  { label: '公司管理', key: 'companies', to: '/admin/companies' },
  { label: '门店管理', key: 'stores', to: '/admin/stores' },
  { label: '课程模板', key: 'course-templates', to: '/admin/course-templates' },
  { label: '排课管理', key: 'scheduling', to: '/admin/schedules' },
  { label: '预约管理', key: 'bookings', to: '/admin/bookings' },
  { label: '签到考勤', key: 'attendance', to: '/admin/attendance' },
  { label: '数据看板', key: 'analytics' },
];
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
        <template v-for="item in navItems" :key="item.key">
          <RouterLink
            v-if="item.to"
            class="admin-layout__nav-item"
            :to="item.to"
            @click="sidebarOpen = false"
          >
            {{ item.label }}
          </RouterLink>
          <span v-else class="admin-layout__nav-item is-disabled"> {{ item.label }} · 待开发 </span>
        </template>
      </nav>
    </aside>

    <div class="admin-layout__main">
      <header class="admin-layout__header">
        <h2 class="admin-layout__title">管理后台</h2>
        <div class="admin-layout__user-area">
          <slot name="header-extra" />
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
  background: var(--color-bg);
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
  width: 240px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-6) 0;
  box-shadow: var(--shadow-xs);
}

.admin-layout__brand {
  padding: 0 var(--space-6) var(--space-6);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-brand);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-4);
}

.admin-layout__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: 0 var(--space-3);
}

.admin-layout__nav-item {
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

.admin-layout__nav-item:hover {
  background: var(--color-brand-light);
  color: var(--color-brand);
}
.admin-layout__nav-item.router-link-active {
  background: var(--color-brand-light);
  color: var(--color-brand);
  font-weight: var(--font-semibold);
}
.admin-layout__nav-item.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.admin-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
}

.admin-layout__title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.admin-layout__content {
  flex: 1;
  padding: var(--space-6);
  width: 100%;
  max-width: calc(var(--content-max-width) + var(--space-12));
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
    padding: var(--space-4);
  }
}
</style>
