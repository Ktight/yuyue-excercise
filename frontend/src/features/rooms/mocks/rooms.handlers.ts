import { http, HttpResponse } from 'msw';
import { MOCK_ROOMS } from './rooms.fixtures';
export const roomsHandlers = [
  http.get('/api/rooms/', ({ request }) => {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('store_id');
    const items = storeId ? MOCK_ROOMS.filter((r) => r.store_id === Number(storeId)) : MOCK_ROOMS;
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.post('/api/rooms/', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      store_id?: number;
      capacity?: number;
      description?: string | null;
    };
    if (!body.name?.trim())
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: '场地名称必填' },
        { status: 400 },
      );
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: {
        id: 3,
        company_id: 1,
        name: body.name,
        store_id: body.store_id ?? 1,
        capacity: body.capacity ?? 1,
        description: body.description ?? null,
        status: 'active',
      },
    });
  }),
  http.patch('/api/rooms/:id/', async ({ params, request }) => {
    const room = MOCK_ROOMS.find((item) => item.id === Number(params.id));
    if (!room)
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '场地不存在', errors: {}, request_id: 'req_mock' },
        { status: 404 },
      );
    Object.assign(room, await request.json());
    return HttpResponse.json({ code: 'OK', message: '更新成功', data: room });
  }),
  http.post('/api/rooms/:id/:action/', ({ params }) => {
    const room = MOCK_ROOMS.find((item) => item.id === Number(params.id));
    if (!room)
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '场地不存在', errors: {}, request_id: 'req_mock' },
        { status: 404 },
      );
    const status = params.action === 'activate' ? 'active' : 'inactive';
    room.status = status;
    return HttpResponse.json({ code: 'OK', message: '操作成功', data: room });
  }),
];
