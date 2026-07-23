import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_STORES } from './stores.fixtures';
type Create = components['schemas']['StoreCreateRequest'];
type Update = components['schemas']['StoreUpdateRequest'];
const missing = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '门店不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );
export const storesHandlers = [
  http.get('/api/stores/', ({ request }) => {
    const url = new URL(request.url);
    const company = Number(url.searchParams.get('company_id')) || undefined;
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const items = MOCK_STORES.filter(
      (v) =>
        (!company || v.company === company) && (!search || v.name.toLowerCase().includes(search)),
    );
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.get('/api/stores/:id/', ({ params }) => {
    const item = MOCK_STORES.find((v) => v.id === Number(params.id));
    return item ? HttpResponse.json({ code: 'OK', message: '', data: item }) : missing();
  }),
  http.post('/api/stores/', async ({ request }) => {
    const body = (await request.json()) as Create;
    const item = {
      id: Math.max(...MOCK_STORES.map((v) => v.id)) + 1,
      company: 1,
      ...body,
      status: body.status ?? 'active',
      created_at: new Date().toISOString(),
      rooms: [],
    };
    MOCK_STORES.push(item);
    return HttpResponse.json({ code: 'OK', message: '', data: item }, { status: 201 });
  }),
  http.patch('/api/stores/:id/', async ({ params, request }) => {
    const item = MOCK_STORES.find((v) => v.id === Number(params.id));
    if (!item) return missing();
    Object.assign(item, (await request.json()) as Update);
    return HttpResponse.json({ code: 'OK', message: '', data: item });
  }),
  http.delete('/api/stores/:id/', ({ params }) => {
    const index = MOCK_STORES.findIndex((v) => v.id === Number(params.id));
    if (index < 0) return missing();
    MOCK_STORES.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
