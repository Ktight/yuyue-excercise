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
import { registerGuards } from './guards';

const routes: RouteRecordRaw[] = [
  // 认证路由（登录页等）
  ...authRoutes,

  // 组织管理路由
  ...companiesRoutes,
  ...storesRoutes,
  ...courseTemplatesRoutes,
  ...studentsRoutes,
  ...usersRoutes,
  ...schedulesRoutes,
  ...bookingsRoutes,
  ...attendanceRoutes,

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
      // 后续功能路由在此聚合，例如：
      // { path: 'users', component: () => import('@/features/users') },
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
