import type { components } from '@/generated/api-types';

export const MOCK_COMPANIES: components['schemas']['Company'][] = [
  {
    id: 1,
    name: '静心瑜伽馆',
    address: '北京市朝阳区',
    contact_name: '张女士',
    contact_phone: '13800000001',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '莲花瑜伽中心',
    address: '上海市浦东新区',
    contact_name: '李女士',
    contact_phone: '13800000002',
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
];
