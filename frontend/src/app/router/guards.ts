/**
 * 路由守卫。
 *
 * - guestGuard: 已登录用户访问登录页 → 跳转到对应首页
 * - authGuard: 未登录用户访问受保护页 → 跳转到登录页
 */
import type { Router } from 'vue-router';
import { ROLE_HOME, useAuthStore } from '@/features/auth';
import type { UserRole } from '@/features/auth';

export function getRoleHome(role: UserRole | null): string {
  return role ? ROLE_HOME[role] : '/login';
}

export function registerGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    // 需要 Pinia 实例在 router 之后创建，此处惰性获取
    const authStore = useAuthStore();

    // 确保会话已恢复（首次访问时）
    if (!authStore.isInitialized) {
      await authStore.restoreSession();
    }

    const isAuthenticated = authStore.isAuthenticated;
    const isGuestRoute = to.meta.guest === true;

    // 已登录 → 登录页：重定向到对应首页
    if (isGuestRoute && isAuthenticated) {
      if (!authStore.userRole) {
        authStore.logout();
        return next();
      }
      return next(getRoleHome(authStore.userRole));
    }

    // 未登录 → 受保护页：重定向到登录页
    if (!isGuestRoute && !isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    const allowedRoles = to.meta.roles;
    if (
      isAuthenticated &&
      Array.isArray(allowedRoles) &&
      allowedRoles.length > 0 &&
      (!authStore.userRole || !allowedRoles.includes(authStore.userRole))
    ) {
      return next({ name: 'forbidden' });
    }

    next();
  });
}
