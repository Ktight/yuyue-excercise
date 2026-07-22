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

  it('nests management feature pages inside the admin layout', () => {
    const resolved = router.resolve('/admin/attendance');
    expect(resolved.matched.map((record) => record.path)).toEqual(['/admin', '/admin/attendance']);
  });

  it('nests trainer feature pages inside the trainer layout', () => {
    const resolved = router.resolve('/trainer/schedules/1');
    expect(resolved.matched.map((record) => record.path)).toEqual([
      '/trainer',
      '/trainer/schedules/:id',
    ]);
    expect(resolved.meta.roles).toEqual(['trainer']);
  });

  it('nests student feature pages inside the student layout', () => {
    const resolved = router.resolve('/student/bookings');
    expect(resolved.matched.map((record) => record.path)).toEqual([
      '/student',
      '/student/bookings',
    ]);
  });
});
