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
];
