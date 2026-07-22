<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logoutSession, sessionSummary } from '@/shared/session';

const router = useRouter();

async function logout() {
  logoutSession();
  await router.replace('/login');
}
</script>

<template>
  <div class="account-actions">
    <span class="account-actions__name">{{ sessionSummary?.name || '当前用户' }}</span>
    <RouterLink class="account-actions__link" to="/change-password">修改密码</RouterLink>
    <button class="account-actions__button" type="button" @click="logout">退出登录</button>
  </div>
</template>

<style scoped>
.account-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
}
.account-actions__name {
  color: var(--color-text-secondary);
}
.account-actions__link,
.account-actions__button {
  color: var(--color-brand);
  background: none;
  border: 0;
  text-decoration: none;
  cursor: pointer;
}
@media (max-width: 767px) {
  .account-actions__name {
    display: none;
  }
}
</style>
