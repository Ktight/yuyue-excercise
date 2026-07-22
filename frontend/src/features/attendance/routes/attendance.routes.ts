import type { RouteRecordRaw } from 'vue-router';
import { STAFF_ROLES } from '@/features/auth';
export const attendanceRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/attendance',
    component: () => import('@/features/attendance/pages/AttendanceListPage.vue'),
    meta: { roles: STAFF_ROLES },
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
