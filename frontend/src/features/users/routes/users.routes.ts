import type { RouteRecordRaw } from 'vue-router';

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/users',
    name: 'users-list',
    component: () => import('@/features/users/pages/UserListPage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
  {
    path: '/admin/users/create',
    name: 'users-create',
    component: () => import('@/features/users/pages/UserCreatePage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
  {
    path: '/admin/users/:id',
    name: 'users-detail',
    component: () => import('@/features/users/pages/UserDetailPage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
];
