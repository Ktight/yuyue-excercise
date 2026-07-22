<script setup lang="ts">
import { ref } from 'vue';

const sidebarOpen = ref(false);

const navItems = [
  { label: '首页', key: 'home', to: '/student' },
  { label: '我的课程', key: 'courses', to: '/student/bookings' },
  { label: '我的日程', key: 'schedule' },
  { label: '我的档案', key: 'profile' },
  { label: '训练历史', key: 'history' },
  { label: '阶段报告', key: 'reports' },
];

const primaryNavItems = [
  { label: '首页', key: 'home', icon: '⌂', to: '/student' },
  { label: '学员', key: 'students', icon: '♙' },
  { label: '课程', key: 'courses', icon: '□', to: '/student/bookings' },
  { label: '我的', key: 'profile', icon: '○' },
];
</script>

<template>
  <div class="student-layout">
    <header class="student-layout__topbar">
      <button
        class="student-layout__menu-btn"
        aria-label="切换菜单"
        @click="sidebarOpen = !sidebarOpen"
      >
        <span class="student-layout__menu-icon" />
      </button>
      <h1 class="student-layout__brand">瑜悦练</h1>
      <div class="student-layout__spacer" />
      <div class="student-layout__user-area">
        <slot name="header-extra" />
      </div>
    </header>

    <nav class="student-layout__tabs">
      <template v-for="item in navItems" :key="item.key">
        <RouterLink v-if="item.to" class="student-layout__tab" :to="item.to">
          {{ item.label }}
        </RouterLink>
        <span v-else class="student-layout__tab is-disabled">{{ item.label }}</span>
      </template>
    </nav>

    <aside class="student-layout__drawer" :class="{ 'is-open': sidebarOpen }">
      <nav class="student-layout__drawer-nav">
        <template v-for="item in navItems" :key="item.key">
          <RouterLink
            v-if="item.to"
            class="student-layout__drawer-item"
            :to="item.to"
            @click="sidebarOpen = false"
          >
            {{ item.label }}
          </RouterLink>
          <span v-else class="student-layout__drawer-item is-disabled">
            {{ item.label }} · 待开发
          </span>
        </template>
      </nav>
    </aside>

    <main class="student-layout__content">
      <RouterView />
    </main>

    <nav class="student-layout__bottom-nav" aria-label="学员端主导航">
      <template v-for="item in primaryNavItems" :key="item.key">
        <RouterLink v-if="item.to" class="student-layout__bottom-item" :to="item.to">
          <span class="student-layout__bottom-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
        <span v-else class="student-layout__bottom-item is-disabled">
          <span class="student-layout__bottom-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </span>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.student-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg);
}

.student-layout__topbar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-xs);
}

.student-layout__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  background: none;
  border: none;
  cursor: pointer;
}

.student-layout__menu-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text-primary);
  position: relative;
}

.student-layout__menu-icon::before,
.student-layout__menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-text-primary);
}

.student-layout__menu-icon::before {
  top: -6px;
}

.student-layout__menu-icon::after {
  top: 6px;
}

.student-layout__brand {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-primary-600);
}

.student-layout__spacer {
  flex: 1;
}

.student-layout__tabs {
  display: flex;
  gap: 0;
  padding: 0 var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.student-layout__tab {
  flex-shrink: 0;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.student-layout__tab:hover {
  color: var(--color-brand);
}
.student-layout__tab.router-link-active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
}
.student-layout__tab.is-disabled,
.student-layout__drawer-item.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Drawer for mobile */
.student-layout__drawer {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  z-index: var(--z-overlay);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  transform: translateX(-100%);
  transition: transform var(--transition-normal);
}

.student-layout__drawer.is-open {
  transform: translateX(0);
}

.student-layout__drawer-nav {
  display: flex;
  flex-direction: column;
  padding: var(--space-16) var(--space-4) var(--space-4);
  gap: var(--space-1);
}

.student-layout__drawer-item {
  display: block;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  text-decoration: none;
  border-radius: var(--radius-md);
}

.student-layout__drawer-item:hover {
  background: var(--color-brand-light);
}

.student-layout__content {
  flex: 1;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-5);
}

.student-layout__bottom-nav {
  display: none;
}

@media (max-width: 640px) {
  .student-layout__menu-btn {
    display: none;
  }

  .student-layout__tabs {
    display: none;
  }

  .student-layout__drawer {
    display: none;
  }

  .student-layout__content {
    max-width: var(--mobile-content-max-width);
    padding: 0 0 calc(76px + var(--safe-area-inset-bottom));
  }

  .student-layout__bottom-nav {
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
  }

  .student-layout__bottom-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: var(--space-1);
    color: var(--color-text-secondary);
    font-size: var(--text-xs);
    text-decoration: none;
  }

  .student-layout__bottom-icon {
    font-size: var(--text-xl);
    line-height: 1;
  }

  .student-layout__bottom-item.router-link-active {
    color: var(--color-brand);
    font-weight: var(--font-semibold);
  }

  .student-layout__bottom-item.is-disabled {
    opacity: 0.45;
  }
}
</style>
