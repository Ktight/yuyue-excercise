import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import router from './index';

describe('router', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has login route', () => {
    const loginRoute = router.getRoutes().find((r) => r.name === 'login');
    expect(loginRoute).toBeDefined();
    expect(loginRoute?.path).toBe('/login');
  });

  it('has admin route', () => {
    expect(router.getRoutes().find((r) => r.path === '/admin')).toBeDefined();
  });

  it('has trainer route', () => {
    expect(router.getRoutes().find((r) => r.path === '/trainer')).toBeDefined();
  });

  it('has student route', () => {
    expect(router.getRoutes().find((r) => r.path === '/student')).toBeDefined();
  });

  it('redirects / to /login when not authenticated', async () => {
    await router.push('/');
    await router.isReady();
    // Without auth, guest guard redirects to login
    expect(router.currentRoute.value.path).toBe('/login');
  });

  it('has 404 catch-all route', () => {
    const notFound = router.getRoutes().find((r) => r.name === 'not-found');
    expect(notFound).toBeDefined();
  });
});
