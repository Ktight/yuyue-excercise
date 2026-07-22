import type { components } from '@/generated/api-types';
export const MOCK_ROOMS: components['schemas']['Room'][] = [
  {
    id: 1,
    store: 1,
    name: '大教室',
    capacity: 30,
    facilities: ['瑜伽垫', '音响'],
    status: 'active',
  },
  { id: 2, store: 1, name: '私教室', capacity: 5, facilities: ['镜面墙'], status: 'active' },
];
