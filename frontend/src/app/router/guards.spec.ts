import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { registerGuards } from './guards';
import { useAuthStore } from '@/features/auth';

function createTestRouter() {
  const r = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/login',
        name: 'login',
        meta: { guest: true },
        component: { template: '<div>Login</div>' },
      },
      {
        path: '/admin',
        name: 'admin',
        meta: { roles: ['super_admin', 'company_admin', 'store_manager'] },
        component: { template: '<div>Admin</div>' },
      },
      {
        path: '/trainer',
        name: 'trainer',
        meta: { roles: ['trainer'] },
        component: { template: '<div>Trainer</div>' },
      },
      {
        path: '/student',
        name: 'student',
        meta: { roles: ['student'] },
        component: { template: '<div>Student</div>' },
      },
      {
        path: '/admin-only',
        name: 'admin-only',
        meta: { roles: ['super_admin', 'company_admin', 'store_manager'] },
        component: { template: '<div>Admin only</div>' },
      },
      {
        path: '/forbidden',
        name: 'forbidden',
        component: { template: '<div>Forbidden</div>' },
      },
    ],
  });
  registerGuards(r);
  return r;
}

describe('guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('redirects unauthenticated user to login', async () => {
    const router = createTestRouter();
    await router.push('/admin');
    await router.isReady();
    expect(router.currentRoute.value.name).toBe('login');
  });

  it('redirects authenticated user from login to role home', async () => {
    const router = createTestRouter();
    const store = useAuthStore();
    store.$patch({
      token: 'mock-token',
      user: { id: 1, name: '训练师', phone: '13800000002', role: 'trainer' },
      isInitialized: true,
    });

    await router.push('/login');
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/trainer');
  });

  it('allows unauthenticated access to login page', async () => {
    const router = createTestRouter();
    await router.push('/login');
    await router.isReady();
    expect(router.currentRoute.value.name).toBe('login');
  });

  it('clears an incomplete session instead of looping on login', async () => {
    const router = createTestRouter();
    const store = useAuthStore();
    store.$patch({ token: 'orphan-token', user: null, isInitialized: true });

    await router.push('/login');
    await router.isReady();
    expect(router.currentRoute.value.name).toBe('login');
    expect(store.isAuthenticated).toBe(false);
  });

  it('rejects a trainer entering an admin-only route', async () => {
    const router = createTestRouter();
    const store = useAuthStore();
    store.$patch({
      token: 'mock-token',
      user: { id: 1, name: '训练师', phone: '13800000002', role: 'trainer' },
      isInitialized: true,
    });

    await router.push('/admin-only');
    await router.isReady();
    expect(router.currentRoute.value.name).toBe('forbidden');
  });

  it.each(['super_admin', 'company_admin', 'store_manager'] as const)(
    'allows %s to enter an admin-only route',
    async (role) => {
      const router = createTestRouter();
      const store = useAuthStore();
      store.$patch({
        token: 'mock-token',
        user: { id: 1, name: '管理用户', phone: '13800000001', role },
        isInitialized: true,
      });

      await router.push('/admin-only');
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('admin-only');
    },
  );
});
