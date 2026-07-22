import type { UserRole } from '@/features/auth';
export interface UserDto {
  id: number;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string | null;
  companyId: number | null;
  storeId: number | null;
  isActive: boolean;
}
export interface UserListRequestDto {
  page?: number;
  page_size?: number;
  search?: string;
  role?: UserRole;
  is_active?: boolean;
  store_id?: number;
}
export interface UserCreateRequestDto {
  name: string;
  phone: string;
  password: string;
  role: UserRole;
  storeId?: number | null;
  isActive?: boolean;
}
export interface UserUpdateRequestDto {
  name?: string;
  role?: UserRole;
  storeId?: number | null;
  isActive?: boolean;
}
export interface UserResetPasswordRequestDto {
  newPassword: string;
}
export interface UserListResult {
  items: UserDto[];
  page: number;
  pageSize: number;
  total: number;
}
