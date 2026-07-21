<script setup lang="ts">
defineProps<{
  /** 空数据描述文字 */
  description?: string;
}>();
</script>

<template>
  <div class="app-empty" role="status">
    <div class="app-empty__icon" aria-hidden="true">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2" />
        <line
          x1="20"
          y1="24"
          x2="44"
          y2="24"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          x1="20"
          y1="32"
          x2="36"
          y2="32"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          x1="20"
          y1="40"
          x2="28"
          y2="40"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <p class="app-empty__text">{{ description || '暂无数据' }}</p>
    <slot />
  </div>
</template>

<style scoped>
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-4);
  color: var(--color-text-tertiary);
}

.app-empty__icon {
  opacity: 0.5;
}

.app-empty__text {
  margin: 0;
  font-size: var(--text-sm);
}
</style>
