import type { components } from '@/generated/api-types';
export const MOCK_COMPANIES: components['schemas']['Company'][] = [
  {
    id: 1,
    name: '瑜悦练示范公司 A',
    contact_person: '张女士',
    contact_phone: '13800000001',
    contract_start: '2026-01-01',
    contract_end: '2027-01-01',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '瑜悦练示范公司 B',
    contact_person: '李女士',
    contact_phone: '13800000002',
    contract_start: '2026-02-01',
    contract_end: '2027-02-01',
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
  },
];
