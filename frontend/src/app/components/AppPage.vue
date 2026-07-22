<script setup lang="ts">
defineProps<{
  /** 页面标题 */
  title?: string;
}>();

defineSlots<{
  default: [];
  'header-extra': [];
}>();
</script>

<template>
  <div class="app-page">
    <header v-if="title || $slots['header-extra']" class="app-page__header">
      <h1 v-if="title" class="app-page__title">{{ title }}</h1>
      <div v-if="$slots['header-extra']" class="app-page__extra">
        <slot name="header-extra" />
      </div>
    </header>
    <main class="app-page__body">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: var(--page-padding-y) var(--page-padding-x) var(--space-12);
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.app-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

.app-page__title {
  margin: 0;
  font-size: clamp(var(--text-xl), 2vw, var(--text-3xl));
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.app-page__extra {
  flex-shrink: 0;
}

.app-page__body {
  flex: 1;
}

@media (max-width: 640px) {
  .app-page {
    padding: var(--space-4) var(--space-4) calc(var(--space-16) + var(--safe-area-inset-bottom));
  }

  .app-page__header {
    margin-bottom: var(--space-5);
  }

  .app-page__title {
    font-size: var(--text-lg);
  }
}
</style>
