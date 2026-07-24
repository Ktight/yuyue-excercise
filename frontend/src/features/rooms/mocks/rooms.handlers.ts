import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_ROOMS } from './rooms.fixtures';
type Create = components['schemas']['RoomCreateRequest'];
type Update = components['schemas']['RoomUpdateRequest'];
const missing = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '场地不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );
export const roomsHandlers = [
  http.get('/api/rooms/', ({ request }) => {
    const store = Number(new URL(request.url).searchParams.get('store_id')) || undefined;
    const items = MOCK_ROOMS.filter((v) => !store || v.store === store);
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.get('/api/rooms/:id/', ({ params }) => {
    const item = MOCK_ROOMS.find((v) => v.id === Number(params.id));
    return item ? HttpResponse.json({ code: 'OK', message: '', data: item }) : missing();
  }),
  http.post('/api/rooms/', async ({ request }) => {
    const body = (await request.json()) as Create;
    const item = {
      id: Math.max(...MOCK_ROOMS.map((v) => v.id)) + 1,
      ...body,
      facilities: body.facilities ?? [],
      status: body.status ?? 'active',
    };
    MOCK_ROOMS.push(item);
    return HttpResponse.json({ code: 'OK', message: '', data: item }, { status: 201 });
  }),
  http.patch('/api/rooms/:id/', async ({ params, request }) => {
    const item = MOCK_ROOMS.find((v) => v.id === Number(params.id));
    if (!item) return missing();
    Object.assign(item, (await request.json()) as Update);
    return HttpResponse.json({ code: 'OK', message: '', data: item });
  }),
  http.delete('/api/rooms/:id/', ({ params }) => {
    const index = MOCK_ROOMS.findIndex((v) => v.id === Number(params.id));
    if (index < 0) return missing();
    MOCK_ROOMS.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
