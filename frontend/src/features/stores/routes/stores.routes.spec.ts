import { describe, expect, it } from 'vitest';
import { storesRoutes } from './stores.routes';

describe('stores routes', () => {
  it('keeps store managers read-only for store creation', () => {
    const createRoute = storesRoutes.find((route) => route.path === '/admin/stores/new');

    expect(createRoute?.meta?.roles).toEqual(['super_admin', 'company_admin']);
    expect(createRoute?.meta?.roles).not.toContain('store_manager');
  });
});
