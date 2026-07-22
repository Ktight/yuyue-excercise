import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const attendanceRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/attendance',
    component: () => import('@/features/attendance/pages/AttendanceListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/attendance',
    component: () => import('@/features/attendance/pages/AttendanceListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/student/attendance',
    component: () => import('@/features/attendance/pages/AttendanceListPage.vue'),
    meta: { roles: ['student'] },
  },
];
