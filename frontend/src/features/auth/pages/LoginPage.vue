<script setup lang="ts">
/**
 * 登录页面 — 组装 LoginForm + authStore + router。
 */
import { useRoute, useRouter } from 'vue-router';
import { ROLE_HOME } from '../model';
import { LoginForm } from '../components';
import { useAuthStore } from '../model';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

async function handleLogin(phone: string, password: string) {
  await authStore.login(phone, password);
  const role = authStore.userRole;
  const requested = typeof route.query.redirect === 'string' ? route.query.redirect : '';
  const safeRedirect =
    requested.startsWith('/') && !requested.startsWith('//') && requested !== '/login'
      ? requested
      : null;
  await router.replace(safeRedirect ?? (role ? ROLE_HOME[role] : '/login'));
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__card">
      <h1 class="login-page__title">瑜悦练</h1>
      <p class="login-page__subtitle">瑜伽馆管理系统</p>
      <LoginForm :on-submit="handleLogin" />
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-4);
  background:
    radial-gradient(circle at 20% 10%, var(--color-primary-100), transparent 36%), var(--color-bg);
}

.login-page__card {
  width: 100%;
  max-width: 400px;
  padding: var(--space-8);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
}

.login-page__title {
  margin: 0 0 var(--space-1);
  text-align: center;
  font-size: var(--text-3xl);
  color: var(--color-brand);
}

.login-page__subtitle {
  margin: 0 0 var(--space-8);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
</style>
