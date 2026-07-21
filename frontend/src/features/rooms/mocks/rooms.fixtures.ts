import type { RoomDto } from '@/features/rooms/model';
export const MOCK_ROOMS: RoomDto[] = [
  {
    id: 'r-001',
    name: '大教室A',
    store_id: 's-001',
    capacity: 30,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'r-002',
    name: '私教室1',
    store_id: 's-001',
    capacity: 5,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'r-003',
    name: '高温教室',
    store_id: 's-002',
    capacity: 20,
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
  },
];
