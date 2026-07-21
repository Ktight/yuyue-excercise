import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';

export const companiesRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/companies',
    component: () => import('@/features/companies/pages/CompanyListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/companies/new',
    component: () => import('@/features/companies/pages/CompanyCreatePage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
  {
    path: '/admin/companies/:id',
    component: () => import('@/features/companies/pages/CompanyDetailPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
];
