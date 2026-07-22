import type { components } from '@/generated/api-types';
export const MOCK_STORES: components['schemas']['Store'][] = [
  {
    id: 1,
    company: 1,
    name: '示范门店 A',
    address: '北京市朝阳区建国路 88 号',
    phone: '01088888888',
    business_hours: '07:00-22:00',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    rooms: [],
  },
  {
    id: 2,
    company: 2,
    name: '示范门店 B',
    address: '上海市浦东新区示范路 1 号',
    phone: '02188888888',
    business_hours: '08:00-21:00',
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
    rooms: [],
  },
];
