<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    disabled?: boolean;
    loading?: boolean;
  }>(),
  { type: 'button', variant: 'primary', disabled: false, loading: false },
);
</script>

<template>
  <button
    class="app-button"
    :class="`app-button--${variant}`"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span v-if="loading">处理中…</span>
    <slot v-else />
  </button>
</template>

<style scoped>
.app-button {
  min-height: 40px;
  padding: var(--space-2) var(--space-4);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  transition:
    background var(--duration-fast),
    border-color var(--duration-fast),
    transform var(--duration-fast);
}
.app-button:hover:not(:disabled) {
  transform: translateY(-1px);
}
.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.app-button--primary {
  color: var(--color-text-on-brand);
  background: var(--color-brand);
}
.app-button--secondary {
  color: var(--color-brand);
  background: var(--color-surface);
  border-color: var(--color-brand);
}
.app-button--danger {
  color: var(--color-text-on-brand);
  background: var(--color-danger);
}
.app-button--ghost {
  color: var(--color-text-primary);
  background: transparent;
  border-color: var(--color-border);
}
</style>
