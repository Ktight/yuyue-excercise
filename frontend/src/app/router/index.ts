/**
 * 根路由配置。
 *
 * 设计原则：
 *   - 每个角色的路由独立分组，全部懒加载。
 *   - 功能路由由 features/<feature>/index.ts 提供，此处只做聚合。
 *   - 路由守卫由认证模块（P01）注册，此处不耦合业务逻辑。
 */
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { authRoutes, MANAGEMENT_ROLES } from '@/features/auth';
import { companiesRoutes } from '@/features/companies';
import { storesRoutes } from '@/features/stores';
import { courseTemplatesRoutes } from '@/features/course-templates';
import { studentsRoutes } from '@/features/students';
import { usersRoutes } from '@/features/users';
import { schedulesRoutes } from '@/features/schedules';
import { bookingsRoutes } from '@/features/bookings';
import { attendanceRoutes } from '@/features/attendance';
import { classTemplatesRoutes } from '@/features/class-templates';
import { classRecordsRoutes } from '@/features/class-records';
import { trainingPlansRoutes } from '@/features/training-plans';
import { feedbackRoutes } from '@/features/feedback';
import { reportsRoutes } from '@/features/reports';
import { dashboardRoutes } from '@/features/dashboard';
import { remindersRoutes } from '@/features/reminders';
import { registerGuards } from './guards';

const featureRoutes: RouteRecordRaw[] = [
  ...companiesRoutes,
  ...storesRoutes,
  ...courseTemplatesRoutes,
  ...studentsRoutes,
  ...usersRoutes,
  ...schedulesRoutes,
  ...bookingsRoutes,
  ...attendanceRoutes,
  ...classTemplatesRoutes,
  ...classRecordsRoutes,
  ...trainingPlansRoutes,
  ...feedbackRoutes,
  ...reportsRoutes,
  ...dashboardRoutes,
  ...remindersRoutes,
];

function childrenFor(prefix: '/admin/' | '/trainer/' | '/student/'): RouteRecordRaw[] {
  return featureRoutes
    .filter((route) => typeof route.path === 'string' && route.path.startsWith(prefix))
    .map((route) => ({ ...route, path: route.path.slice(prefix.length) }));
}

const routes: RouteRecordRaw[] = [
  // 认证路由（登录页等）
  ...authRoutes,

  // 根路径重定向
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@/app/views/Forbidden.vue'),
  },

  // -----------------------------------------------------------------------
  // 管理员端
  // -----------------------------------------------------------------------
  {
    path: '/admin',
    component: () => import('@/layouts/admin/AdminLayout.vue'),
    meta: { roles: MANAGEMENT_ROLES },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/app/views/AdminDashboard.vue'),
      },
      ...childrenFor('/admin/'),
    ],
  },

  // -----------------------------------------------------------------------
  // 训练师端
  // -----------------------------------------------------------------------
  {
    path: '/trainer',
    component: () => import('@/layouts/trainer/TrainerLayout.vue'),
    meta: { roles: ['trainer'] },
    children: [
      {
        path: '',
        name: 'trainer-dashboard',
        component: () => import('@/app/views/TrainerDashboard.vue'),
      },
      ...childrenFor('/trainer/'),
    ],
  },

  // -----------------------------------------------------------------------
  // 学员端
  // -----------------------------------------------------------------------
  {
    path: '/student',
    component: () => import('@/layouts/student/StudentLayout.vue'),
    meta: { roles: ['student'] },
    children: [
      {
        path: '',
        name: 'student-home',
        component: () => import('@/app/views/StudentHome.vue'),
      },
      ...childrenFor('/student/'),
    ],
  },

  // 404 兜底
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/app/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 注册全局守卫（需在 Pinia 安装后调用，由 main.ts 触发）
registerGuards(router);

export default router;
