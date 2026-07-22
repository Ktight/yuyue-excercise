import type { components } from '@/generated/api-types';
export const MOCK_ROOMS: components['schemas']['Room'][] = [
  {
    id: 1,
    company_id: 1,
    store_id: 1,
    name: '大教室A',
    capacity: 30,
    description: null,
    status: 'active',
  },
  {
    id: 2,
    company_id: 1,
    store_id: 1,
    name: '私教室1',
    capacity: 5,
    description: null,
    status: 'active',
  },
];
