import { http, HttpResponse } from 'msw';
import { MOCK_ROOMS } from './rooms.fixtures';
import type { RoomDto } from '@/features/rooms/model';
export const roomsHandlers = [
  http.get('/api/rooms', ({ request }) => {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('store_id');
    const items = storeId ? MOCK_ROOMS.filter((r) => r.store_id === storeId) : MOCK_ROOMS;
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.post('/api/rooms', async ({ request }) => {
    const body = (await request.json()) as { name?: string };
    if (!body.name?.trim())
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: '场地名称必填' },
        { status: 400 },
      );
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: {
        id: `r-new-${Date.now()}`,
        name: body.name,
        store_id: '',
        status: 'active',
      } as RoomDto,
    });
  }),
];
