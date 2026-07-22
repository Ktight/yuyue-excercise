import type { RouteRecordRaw } from 'vue-router';
import { STAFF_ROLES } from '@/features/auth';
export const courseTemplatesRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/course-templates',
    component: () => import('@/features/course-templates/pages/CourseTemplateListPage.vue'),
    meta: { roles: STAFF_ROLES },
  },
  {
    path: '/admin/course-templates/new',
    component: () => import('@/features/course-templates/pages/CourseTemplateCreatePage.vue'),
    meta: { roles: ['super_admin', 'company_admin'] },
  },
  {
    path: '/admin/course-templates/:id',
    component: () => import('@/features/course-templates/pages/CourseTemplateDetailPage.vue'),
    meta: { roles: STAFF_ROLES },
  },
];
