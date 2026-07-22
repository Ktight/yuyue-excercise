import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const courseTemplatesRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/course-templates',
    component: () => import('@/features/course-templates/pages/CourseTemplateListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/course-templates/new',
    component: () => import('@/features/course-templates/pages/CourseTemplateCreatePage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
  {
    path: '/admin/course-templates/:id',
    component: () => import('@/features/course-templates/pages/CourseTemplateDetailPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/course-templates',
    component: () => import('@/features/course-templates/pages/CourseTemplateListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/course-templates/:id',
    component: () => import('@/features/course-templates/pages/CourseTemplateDetailPage.vue'),
    meta: { roles: ['trainer'] },
  },
];
