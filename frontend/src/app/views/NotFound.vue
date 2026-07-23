<script setup lang="ts">
import { useRouter } from 'vue-router';
import { sessionSummary } from '@/shared/session';
/**
 * 404 页面。
 */
const router = useRouter();
function goHome() {
  const target =
    sessionSummary.value?.role === 'trainer'
      ? '/trainer'
      : sessionSummary.value?.role === 'student'
        ? '/student'
        : '/admin';
  void router.push(sessionSummary.value ? target : '/login');
}
</script>

<template>
  <div class="not-found">
    <h2>页面未找到</h2>
    <p>请检查地址是否正确</p>
    <button @click="goHome">返回首页</button>
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
.not-found button {
  margin-top: var(--space-4);
  padding: var(--space-2) var(--space-5);
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border: 0;
  border-radius: var(--radius-button);
}
.not-found h2 {
  margin: 0 0 var(--space-2);
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
}
</style>
