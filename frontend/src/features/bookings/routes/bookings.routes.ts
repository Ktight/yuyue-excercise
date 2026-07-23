import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const bookingsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/bookings',
    component: () => import('@/features/bookings/pages/BookingListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/bookings/:id',
    component: () => import('@/features/bookings/pages/BookingDetailPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/bookings',
    component: () => import('@/features/bookings/pages/BookingListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/bookings/:id',
    component: () => import('@/features/bookings/pages/BookingDetailPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/student/bookings',
    component: () => import('@/features/bookings/pages/BookingListPage.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: '/student/bookings/:id',
    component: () => import('@/features/bookings/pages/BookingDetailPage.vue'),
    meta: { roles: ['student'] },
  },
];
