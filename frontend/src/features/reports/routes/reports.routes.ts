import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const reportsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/reports',
    component: () => import('../pages/ReportCreatePage.vue'),
    meta: { roles: MANAGEMENT_ROLES, provisional: true },
  },
  {
    path: '/trainer/reports',
    component: () => import('../pages/ReportCreatePage.vue'),
    meta: { roles: ['trainer'], provisional: true },
  },
  {
    path: '/student/reports',
    component: () => import('../pages/StudentReportPage.vue'),
    meta: { roles: ['student'] },
  },
];
