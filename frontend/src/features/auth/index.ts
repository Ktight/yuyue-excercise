/**
 * 认证模块公开出口。
 *
 * 外部只能从此 index.ts 导入，禁止深层导入。
 */
export { login, refreshToken, getProfile, changePassword } from './api';
export { useAuthStore, tokenStorage } from './model';
export { LoginForm } from './components';
export { authRoutes } from './routes';
export type {
  UserRole,
  LoginRequestDto,
  ChangePasswordRequestDto,
  UserDto,
  LoginResponseDto,
  RefreshResponseDto,
  RefreshRequestDto,
  AuthTokens,
  UserProfile,
} from './model';
export { USER_ROLES, MANAGEMENT_ROLES, STAFF_ROLES, ROLE_LABELS, ROLE_HOME } from './model';
export { authHandlers } from './mocks/auth.handlers';
