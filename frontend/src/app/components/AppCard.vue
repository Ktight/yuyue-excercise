<script setup lang="ts">
withDefaults(defineProps<{ interactive?: boolean }>(), { interactive: false });
</script>

<template>
  <article class="app-card" :class="{ 'app-card--interactive': interactive }">
    <slot />
  </article>
</template>

<style scoped>
.app-card {
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.app-card--interactive {
  cursor: pointer;
  transition:
    transform var(--duration-fast),
    box-shadow var(--duration-fast);
}
.app-card--interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}
</style>
