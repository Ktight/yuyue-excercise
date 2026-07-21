<script setup lang="ts">
/**
 * 训练师首页占位。
 * 后续由 features/ 中的真实页面替换。
 */
import { AppLoading } from '@/app/components';
</script>

<template>
  <div class="placeholder-page">
    <h3>训练师工作台</h3>
    <p>欢迎使用瑜悦练训练师端</p>
    <AppLoading text="等待功能模块加载..." />
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-12);
  color: var(--color-text-secondary);
}
.placeholder-page h3 {
  margin: 0 0 var(--space-2);
  font-size: var(--text-xl);
  color: var(--color-text-primary);
}
</style>
