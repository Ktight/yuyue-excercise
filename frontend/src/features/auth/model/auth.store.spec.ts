import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { authHandlers } from '@/features/auth/mocks/auth.handlers';
import { MOCK_REFRESH_TOKEN } from '@/features/auth/mocks/auth.fixtures';
import { useAuthStore } from './auth.store';
import { tokenStorage } from './token-storage';

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    server.use(...authHandlers);
    tokenStorage.remove();
  });
  it('stores a complete login session', async () => {
    const store = useAuthStore();
    await store.login('13800000002', '12345678');
    expect(store.user?.name).toBe('张教练');
    expect(tokenStorage.getAccess()).toBeTruthy();
    expect(tokenStorage.getRefresh()).toBe(MOCK_REFRESH_TOKEN);
  });
  it('restores a stored session', async () => {
    tokenStorage.set({ accessToken: 'access', refreshToken: MOCK_REFRESH_TOKEN });
    const store = useAuthStore();
    await store.restoreSession();
    expect(store.isAuthenticated).toBe(true);
  });
  it('persists rotated tokens', async () => {
    tokenStorage.set({ accessToken: 'access', refreshToken: MOCK_REFRESH_TOKEN });
    const store = useAuthStore();
    await store.refresh();
    expect(tokenStorage.getRefresh()).toBe('mock-rotated-refresh-token');
  });
  it('clears both tokens on logout', async () => {
    const store = useAuthStore();
    await store.login('13800000002', '12345678');
    store.logout();
    expect(tokenStorage.getAccess()).toBeNull();
    expect(tokenStorage.getRefresh()).toBeNull();
  });
});
