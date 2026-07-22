import type { RouteRecordRaw } from 'vue-router';

export const companiesRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/companies',
    component: () => import('@/features/companies/pages/CompanyListPage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
  {
    path: '/admin/companies/new',
    component: () => import('@/features/companies/pages/CompanyCreatePage.vue'),
    meta: { roles: ['super_admin'] },
  },
  {
    path: '/admin/companies/:id',
    component: () => import('@/features/companies/pages/CompanyDetailPage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
];
