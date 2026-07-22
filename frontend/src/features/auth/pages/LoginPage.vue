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
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 18%, rgba(220, 79, 11, 0.13), transparent 28rem),
    radial-gradient(circle at 86% 82%, rgba(220, 79, 11, 0.08), transparent 24rem), #fbfaf7;
}
.login-page::before {
  content: '瑜';
  position: fixed;
  right: max(5vw, var(--space-6));
  bottom: -8vh;
  font-family: Georgia, serif;
  font-size: min(52vw, 36rem);
  line-height: 1;
  color: rgba(220, 79, 11, 0.035);
  pointer-events: none;
}

.login-page__card {
  width: 100%;
  position: relative;
  max-width: 420px;
  padding: var(--space-10);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
}

.login-page__title {
  margin: 0 0 var(--space-1);
  text-align: center;
  font-family: Georgia, 'Noto Serif SC', serif;
  font-size: var(--text-4xl);
  color: var(--color-brand);
}

.login-page__subtitle {
  margin: 0 0 var(--space-8);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

@media (max-width: 640px) {
  .login-page {
    align-items: stretch;
    padding: var(--space-5);
  }
  .login-page__card {
    margin: auto 0;
    padding: var(--space-8) var(--space-5);
    border: 0;
    box-shadow: none;
  }
}
</style>
