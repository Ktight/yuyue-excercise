import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const remindersRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/reminders',
    component: () => import('../pages/ReminderCenterPage.vue'),
    meta: { roles: MANAGEMENT_ROLES, provisional: true },
  },
];
