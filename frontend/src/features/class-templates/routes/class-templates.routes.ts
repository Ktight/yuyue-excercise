import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const classTemplatesRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/class-templates',
    component: () => import('@/features/class-templates/pages/ClassTemplateListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/class-templates/new',
    component: () => import('@/features/class-templates/pages/ClassTemplateCreatePage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
  {
    path: '/admin/class-templates/:id',
    component: () => import('@/features/class-templates/pages/ClassTemplateDetailPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/class-templates',
    component: () => import('@/features/class-templates/pages/ClassTemplateListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/class-templates/:id',
    component: () => import('@/features/class-templates/pages/ClassTemplateDetailPage.vue'),
    meta: { roles: ['trainer'] },
  },
];
