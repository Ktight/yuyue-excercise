import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const studentsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/students',
    component: () => import('@/features/students/pages/StudentListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/students/new',
    component: () => import('@/features/students/pages/StudentCreatePage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/students/:id',
    component: () => import('@/features/students/pages/StudentDetailPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/students',
    component: () => import('@/features/students/pages/StudentListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/students/new',
    component: () => import('@/features/students/pages/StudentCreatePage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/students/:id',
    component: () => import('@/features/students/pages/StudentDetailPage.vue'),
    meta: { roles: ['trainer'] },
  },
];
