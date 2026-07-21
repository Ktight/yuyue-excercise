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
  trainer: { phone: '13800000002', password: '12345678' },
  admin: { phone: '13800000001', password: '12345678' },
};
