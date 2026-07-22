import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const bookingsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/bookings',
    component: () => import('@/features/bookings/pages/BookingListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/bookings',
    component: () => import('@/features/bookings/pages/BookingListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/student/bookings',
    component: () => import('@/features/bookings/pages/BookingListPage.vue'),
    meta: { roles: ['student'] },
  },
];
