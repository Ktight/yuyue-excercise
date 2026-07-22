import type { components } from '@/generated/api-types';
export const MOCK_STORES: components['schemas']['Store'][] = [
  {
    id: 1,
    company_id: 1,
    name: '静心瑜伽-朝阳店',
    address: '北京市朝阳区建国路88号',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    company_id: 1,
    name: '静心瑜伽-海淀店',
    address: '北京市海淀区中关村大街1号',
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
];
