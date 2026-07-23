<script setup lang="ts">
defineProps<{ label: string; error?: string; hint?: string; required?: boolean }>();
</script>

<template>
  <label class="field">
    <span class="field__label">{{ label }} <b v-if="required" aria-hidden="true">*</b></span>
    <slot />
    <small v-if="error" class="field__error" role="alert">{{ error }}</small>
    <small v-else-if="hint" class="field__hint">{{ hint }}</small>
  </label>
</template>

<style scoped>
.field {
  display: grid;
  gap: var(--space-2);
}
.field__label {
  font-weight: 600;
}
.field__label b,
.field__error {
  color: var(--color-danger);
}
.field__hint {
  color: var(--color-text-secondary);
}
.field :deep(input),
.field :deep(select),
.field :deep(textarea) {
  width: 100%;
  min-height: 40px;
  padding: var(--space-2) var(--space-3);
  font: inherit;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}
.field :deep(input:focus),
.field :deep(select:focus),
.field :deep(textarea:focus) {
  border-color: var(--color-brand);
  outline: 2px solid color-mix(in srgb, var(--color-brand) 20%, transparent);
}
</style>
