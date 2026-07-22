import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES, STAFF_ROLES } from '@/features/auth';
export const schedulesRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/schedules',
    component: () => import('@/features/schedules/pages/ScheduleListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/schedules/new',
    component: () => import('@/features/schedules/pages/ScheduleCreatePage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/schedules/:id',
    component: () => import('@/features/schedules/pages/ScheduleDetailPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/schedules',
    component: () => import('@/features/schedules/pages/ScheduleListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/schedules/:id',
    component: () => import('@/features/schedules/pages/ScheduleDetailPage.vue'),
    meta: { roles: STAFF_ROLES },
  },
];
