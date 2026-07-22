/**
 * 全局路由守卫。
 *
 * 使用 Vue Router 的返回值模式，避免已弃用的 next 回调，并保证所有分支
 * 都明确返回“放行”或重定向目标。
 */
import type { Router } from 'vue-router';
import { ROLE_HOME, useAuthStore } from '@/features/auth';
import type { UserRole } from '@/features/auth';

export function getRoleHome(role: UserRole | null): string {
  return role ? ROLE_HOME[role] : '/login';
}

export function registerGuards(router: Router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    if (!authStore.isInitialized) {
      await authStore.restoreSession();
    }

    const isAuthenticated = authStore.isAuthenticated;
    const isGuestRoute = to.meta.guest === true;

    if (isGuestRoute && isAuthenticated) {
      if (!authStore.userRole) {
        authStore.logout();
        return true;
      }
      return getRoleHome(authStore.userRole);
    }

    if (!isGuestRoute && !isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }

    const allowedRoles = to.meta.roles;
    if (
      isAuthenticated &&
      Array.isArray(allowedRoles) &&
      allowedRoles.length > 0 &&
      (!authStore.userRole || !allowedRoles.includes(authStore.userRole))
    ) {
      return { name: 'forbidden' };
    }

    return true;
  });
}
