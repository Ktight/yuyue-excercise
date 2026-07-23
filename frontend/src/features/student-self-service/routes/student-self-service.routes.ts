import type { RouteRecordRaw } from 'vue-router';

export const studentSelfServiceRoutes: RouteRecordRaw[] = [
  {
    path: '/student/history',
    component: () => import('../pages/StudentHistoryPage.vue'),
    meta: { roles: ['student'], provisional: true },
  },
  {
    path: '/student/history/:id',
    component: () => import('../pages/StudentHistoryDetailPage.vue'),
    meta: { roles: ['student'], provisional: true },
  },
  {
    path: '/student/plans',
    component: () => import('../pages/StudentPlansPage.vue'),
    meta: { roles: ['student'], provisional: true },
  },
  {
    path: '/student/plans/:id',
    component: () => import('../pages/StudentPlanDetailPage.vue'),
    meta: { roles: ['student'], provisional: true },
  },
  {
    path: '/student/profile',
    component: () => import('../pages/StudentProfileArchivePage.vue'),
    meta: { roles: ['student'], provisional: true },
  },
];
