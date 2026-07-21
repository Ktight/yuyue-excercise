import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getProfile, login as loginApi, refreshToken } from '@/features/auth/api';
import { tokenStorage } from './token-storage';
import { configureSessionRecovery } from '@/shared/api';
import type { UserProfile, UserRole } from './auth.types';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(tokenStorage.getAccess());
  const user = ref<UserProfile | null>(null);
  const isInitialized = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value));
  const userRole = computed<UserRole | null>(() => user.value?.role ?? null);

  async function login(phone: string, password: string) {
    const result = await loginApi({ phone, password });
    persistTokens(result.accessToken, result.refreshToken);
    user.value = result.user;
    isInitialized.value = true;
  }

  async function restoreSession() {
    const storedAccessToken = tokenStorage.getAccess();
    if (!storedAccessToken) {
      isInitialized.value = true;
      return;
    }

    token.value = storedAccessToken;
    try {
      const result = await getProfile();
      user.value = result;
    } catch {
      clearSession();
    } finally {
      isInitialized.value = true;
    }
  }

  async function refresh() {
    const storedRefreshToken = tokenStorage.getRefresh();
    if (!storedRefreshToken) {
      clearSession();
      throw new Error('Refresh token is missing');
    }

    const result = await refreshToken({ refresh_token: storedRefreshToken });
    persistTokens(result.accessToken, result.refreshToken);
  }

  function logout() {
    clearSession();
    isInitialized.value = true;
  }

  function persistTokens(accessToken: string, refreshTokenValue: string) {
    token.value = accessToken;
    tokenStorage.set({ accessToken, refreshToken: refreshTokenValue });
  }

  function clearSession() {
    token.value = null;
    user.value = null;
    tokenStorage.remove();
  }

  configureSessionRecovery(async () => {
    try {
      await refresh();
    } catch (error) {
      clearSession();
      throw error;
    }
  });

  return {
    token,
    user,
    isInitialized,
    isAuthenticated,
    userRole,
    login,
    restoreSession,
    refresh,
    logout,
  };
});
