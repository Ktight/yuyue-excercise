import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const storesRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/stores',
    component: () => import('@/features/stores/pages/StoreListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/stores/new',
    component: () => import('@/features/stores/pages/StoreCreatePage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
];
