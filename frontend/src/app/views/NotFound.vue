<script setup lang="ts">
/**
 * 404 页面。
 */
</script>

<template>
  <div class="not-found">
    <h2>页面未找到</h2>
    <p>请检查地址是否正确</p>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--color-text-secondary);
}
.not-found h2 {
  margin: 0 0 var(--space-2);
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
}
</style>
