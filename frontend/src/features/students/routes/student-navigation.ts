/**
 * 学员模块的角色路由导航。
 *
 * 管理端和训练师端复用同一套页面组件，因此页面不能把跳转写死到
 * `/admin`。这里仅根据已经进入的路由分组保留当前角色入口，不参与
 * 权限判断；最终权限仍由路由守卫和后端负责。
 */
export function getStudentsBasePath(currentPath: string): '/admin/students' | '/trainer/students' {
  return currentPath === '/trainer' || currentPath.startsWith('/trainer/')
    ? '/trainer/students'
    : '/admin/students';
}

export function getStudentCreatePath(currentPath: string): string {
  return `${getStudentsBasePath(currentPath)}/new`;
}

export function getStudentDetailPath(currentPath: string, studentId: string | number): string {
  return `${getStudentsBasePath(currentPath)}/${studentId}`;
}
