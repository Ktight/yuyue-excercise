<script setup lang="ts">
defineProps<{
  /** 错误消息 */
  message?: string;
  /** 是否显示重试按钮 */
  showRetry?: boolean;
  /** 重试按钮文字 */
  retryText?: string;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="app-error" role="alert">
    <div class="app-error__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" />
        <line
          x1="24"
          y1="14"
          x2="24"
          y2="26"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <circle cx="24" cy="31" r="1.5" fill="currentColor" />
      </svg>
    </div>
    <p class="app-error__message">{{ message || '加载失败，请稍后重试' }}</p>
    <button v-if="showRetry" class="app-error__retry" @click="emit('retry')">
      {{ retryText || '重试' }}
    </button>
    <slot />
  </div>
</template>

<style scoped>
.app-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-4);
  color: var(--color-error);
}

.app-error__icon {
  opacity: 0.8;
}

.app-error__message {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.app-error__retry {
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-6);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.app-error__retry:hover {
  background: var(--color-brand-hover);
}
</style>
