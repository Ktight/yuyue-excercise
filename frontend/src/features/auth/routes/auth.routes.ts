/**
 * 认证模块路由。
 *
 * 所有路由懒加载，由根路由聚合。
 */
import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/pages/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import('@/features/auth/pages/ChangePasswordPage.vue'),
    meta: { roles: ['super_admin', 'company_admin', 'store_manager', 'trainer', 'student'] },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/features/auth/pages/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
];
