/**
 * 创建用户表单校验规则。
 */
import type { UserRole } from '@/features/auth';

export interface UserCreateFormData {
  name: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface FieldError {
  field: keyof UserCreateFormData;
  message: string;
}

export function validateUserCreateForm(data: UserCreateFormData): FieldError[] {
  const errors: FieldError[] = [];

  if (!data.name.trim()) {
    errors.push({ field: 'name', message: '请输入姓名' });
  }

  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: '请输入手机号' });
  } else if (!/^1[3-9]\d{9}$/.test(data.phone.trim())) {
    errors.push({ field: 'phone', message: '请输入正确的手机号' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: '请输入密码' });
  } else if (data.password.length < 6) {
    errors.push({ field: 'password', message: '密码至少 6 位' });
  }

  return errors;
}
