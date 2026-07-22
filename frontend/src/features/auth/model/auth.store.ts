import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  getProfile,
  login as loginApi,
  logout as logoutApi,
  refreshToken,
} from '@/features/auth/api';
import { tokenStorage } from './token-storage';
import { configureSessionRecovery } from '@/shared/api';
import { configureSessionLogout, publishSession } from '@/shared/session';
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
    publishSession({ name: result.user.name, role: result.user.role });
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
      publishSession({ name: result.name, role: result.role });
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

  async function logout() {
    const refreshTokenValue = tokenStorage.getRefresh();
    clearSession();
    isInitialized.value = true;
    try {
      if (refreshTokenValue) await logoutApi(refreshTokenValue);
    } catch {
      // Local logout must succeed even when the revoke endpoint is unavailable.
    }
  }

  function persistTokens(accessToken: string, refreshTokenValue: string) {
    token.value = accessToken;
    tokenStorage.set({ accessToken, refreshToken: refreshTokenValue });
  }

  function clearSession() {
    token.value = null;
    user.value = null;
    publishSession(null);
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
  configureSessionLogout(logout);

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
