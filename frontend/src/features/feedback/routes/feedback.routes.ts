import type { RouteRecordRaw } from 'vue-router';

export const feedbackRoutes: RouteRecordRaw[] = [
  {
    path: '/student/class-records/:recordId/feedback',
    component: () => import('../pages/FeedbackFormPage.vue'),
    meta: { roles: ['student'], provisional: true },
  },
];
