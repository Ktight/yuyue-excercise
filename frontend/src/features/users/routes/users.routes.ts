import type { RouteRecordRaw } from 'vue-router';

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/users',
    component: () => import('@/features/users/pages/UserListPage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
];
