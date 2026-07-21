import type { StoreDto } from '@/features/stores/model';
export const MOCK_STORES: StoreDto[] = [
  {
    id: 's-001',
    name: '静心瑜伽-朝阳店',
    company_id: 'c-001',
    address: '北京市朝阳区建国路88号',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 's-002',
    name: '静心瑜伽-海淀店',
    company_id: 'c-001',
    address: '北京市海淀区中关村大街1号',
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 's-003',
    name: '莲花瑜伽-浦东店',
    company_id: 'c-002',
    address: '上海市浦东新区陆家嘴',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z',
  },
];
