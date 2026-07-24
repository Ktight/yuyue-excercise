import type { components } from '@/generated/api-types';

type UserDto = components['schemas']['User'];
type LoginResponseDto = components['schemas']['LoginData'];
type RefreshResponseDto = components['schemas']['TokenData'];

export const MOCK_USER_ADMIN: UserDto = {
  id: 1,
  name: '管理员',
  phone: '13800000001',
  role: 'super_admin',
  avatar: null,
  company_id: null,
  store_id: null,
  is_active: true,
};

export const MOCK_USER_TRAINER: UserDto = {
  id: 2,
  name: '张教练',
  phone: '13800000002',
  role: 'trainer',
  avatar: null,
  company_id: 1,
  store_id: 1,
  is_active: true,
};

export const MOCK_USER_COMPANY_ADMIN: UserDto = {
  id: 4,
  name: '公司管理员',
  phone: '13800000004',
  role: 'company_admin',
  avatar: null,
  company_id: 1,
  store_id: null,
  is_active: true,
};

export const MOCK_USER_STORE_MANAGER: UserDto = {
  id: 5,
  name: '门店店长',
  phone: '13800000005',
  role: 'store_manager',
  avatar: null,
  company_id: 1,
  store_id: 1,
  is_active: true,
};

export const MOCK_USER_STUDENT: UserDto = {
  id: 3,
  name: '李学员',
  phone: '13800000003',
  role: 'student',
  avatar: null,
  company_id: 1,
  store_id: 1,
  is_active: true,
};

export const MOCK_ACCESS_TOKEN = 'mock-access-token';
export const MOCK_REFRESH_TOKEN = 'mock-refresh-token';

export const MOCK_LOGIN_RESPONSE: LoginResponseDto = {
  access_token: MOCK_ACCESS_TOKEN,
  refresh_token: MOCK_REFRESH_TOKEN,
  token_type: 'Bearer',
  expires_in: 1800,
  refresh_expires_in: 604800,
  user: MOCK_USER_TRAINER,
};

export const MOCK_REFRESH_RESPONSE: RefreshResponseDto = {
  access_token: 'mock-refreshed-access-token',
  refresh_token: 'mock-rotated-refresh-token',
  token_type: 'Bearer',
  expires_in: 1800,
  refresh_expires_in: 604800,
};

export const TEST_CREDENTIALS = {
  super_admin: { phone: '13800000001', password: '12345678' },
  company_admin: { phone: '13800000004', password: '12345678' },
  store_manager: { phone: '13800000005', password: '12345678' },
  trainer: { phone: '13800000002', password: '12345678' },
  student: { phone: '13800000003', password: '12345678' },
};
