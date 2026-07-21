import { USER_ROLE, USER_ROLE_LABELS, type UserRole } from '@/generated/enums';

export { type UserRole };

export const USER_ROLES = Object.values(USER_ROLE) as readonly UserRole[];
export const MANAGEMENT_ROLES: readonly UserRole[] = [
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.COMPANY_ADMIN,
  USER_ROLE.STORE_MANAGER,
];
export const STAFF_ROLES: readonly UserRole[] = [...MANAGEMENT_ROLES, USER_ROLE.TRAINER];
export const ROLE_LABELS = USER_ROLE_LABELS;
export const ROLE_HOME: Readonly<Record<UserRole, string>> = {
  super_admin: '/admin',
  company_admin: '/admin',
  store_manager: '/admin',
  trainer: '/trainer',
  student: '/student',
};

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string | null;
  companyId?: number | null;
  storeId?: number | null;
  isActive?: boolean;
}

export interface LoginRequestDto {
  phone: string;
  password: string;
}
export interface ChangePasswordRequestDto {
  old_password: string;
  new_password: string;
}
export interface RefreshRequestDto {
  refresh_token: string;
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}
export interface LoginResponseDto extends AuthTokens {
  user: UserProfile;
}
export type RefreshResponseDto = AuthTokens;
export type UserDto = UserProfile;
