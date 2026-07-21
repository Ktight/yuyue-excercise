<script setup lang="ts">
defineProps<{
  /** 状态文案 */
  label: string;
  /** 状态类型，决定颜色 */
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
}>();
</script>

<template>
  <span class="app-status-tag" :class="`app-status-tag--${type || 'default'}`">
    {{ label }}
  </span>
</template>

<style scoped>
.app-status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-tag);
  white-space: nowrap;
  line-height: var(--leading-tight);
}

.app-status-tag--default {
  color: var(--color-text-secondary);
  background: var(--color-neutral-100);
}

.app-status-tag--success {
  color: var(--color-success-600);
  background: var(--color-success-50);
}

.app-status-tag--warning {
  color: var(--color-warning-600);
  background: var(--color-warning-50);
}

.app-status-tag--error {
  color: var(--color-error-600);
  background: var(--color-error-50);
}

.app-status-tag--info {
  color: var(--color-info-600);
  background: var(--color-info-50);
}
</style>
