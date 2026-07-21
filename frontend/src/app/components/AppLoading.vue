<script setup lang="ts">
defineProps<{
  /** 加载提示文字，默认"加载中..." */
  text?: string;
}>();
</script>

<template>
  <div class="app-loading" role="status" aria-live="polite">
    <div class="app-loading__spinner" aria-hidden="true" />
    <p v-if="text !== undefined" class="app-loading__text">{{ text }}</p>
    <p v-else class="app-loading__text">加载中...</p>
  </div>
</template>

<style scoped>
.app-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-12) var(--space-4);
  color: var(--color-text-secondary);
}

.app-loading__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-brand);
  border-radius: var(--radius-full);
  animation: app-loading-spin 0.8s linear infinite;
}

@keyframes app-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.app-loading__text {
  margin: 0;
  font-size: var(--text-sm);
}
</style>
