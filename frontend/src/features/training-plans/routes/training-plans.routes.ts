import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const trainingPlansRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/training-plans',
    component: () => import('../pages/TrainingPlanListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/training-plans/:id',
    component: () => import('../pages/TrainingPlanDetailPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/training-plans',
    component: () => import('../pages/TrainingPlanListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/training-plans/new',
    component: () => import('../pages/TrainingPlanCreatePage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/training-plans/:id',
    component: () => import('../pages/TrainingPlanDetailPage.vue'),
    meta: { roles: ['trainer'] },
  },
];
