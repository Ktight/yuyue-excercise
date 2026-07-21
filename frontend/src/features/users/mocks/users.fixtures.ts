import type { components } from '@/generated/api-types';

type UserDto = components['schemas']['User'];

const base = {
  avatar: null,
  company_id: 1,
  store_id: 1,
  is_active: true,
} as const;

export const MOCK_USERS: UserDto[] = [
  { ...base, id: 1, name: '管理员', phone: '13800000001', role: 'company_admin', store_id: null },
  { ...base, id: 2, name: '张教练', phone: '13800000002', role: 'trainer' },
  { ...base, id: 3, name: '李教练', phone: '13800000004', role: 'trainer' },
  { ...base, id: 4, name: '王学员', phone: '13800000005', role: 'student' },
  { ...base, id: 5, name: '赵学员', phone: '13800000006', role: 'student' },
];
