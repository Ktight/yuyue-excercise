import type { RouteRecordRaw } from 'vue-router';
import { MANAGEMENT_ROLES } from '@/features/auth';
export const classRecordsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/class-records',
    component: () => import('@/features/class-records/pages/ClassRecordListPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/admin/class-records/:id',
    component: () => import('@/features/class-records/pages/ClassRecordDetailPage.vue'),
    meta: { roles: MANAGEMENT_ROLES },
  },
  {
    path: '/trainer/class-records',
    component: () => import('@/features/class-records/pages/ClassRecordListPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/class-records/new',
    component: () => import('@/features/class-records/pages/ClassRecordCreatePage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/class-records/batch',
    component: () => import('@/features/class-records/pages/ClassRecordBatchPage.vue'),
    meta: { roles: ['trainer'] },
  },
  {
    path: '/trainer/class-records/:id',
    component: () => import('@/features/class-records/pages/ClassRecordDetailPage.vue'),
    meta: { roles: ['trainer'] },
  },
];
