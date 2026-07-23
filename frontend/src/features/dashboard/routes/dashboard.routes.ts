import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/analytics',
    component: () => import('../pages/AdminDashboardPage.vue'),
    meta: { roles: MANAGEMENT_ROLES, provisional: true },
  },
];
