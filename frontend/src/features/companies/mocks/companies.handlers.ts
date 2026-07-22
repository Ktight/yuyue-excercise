import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_COMPANIES } from './companies.fixtures';
type Create = components['schemas']['CompanyCreateRequest'];
type Update = components['schemas']['CompanyUpdateRequest'];
const missing = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '公司不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );
export const companiesHandlers = [
  http.get('/api/companies/', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const status = url.searchParams.get('status');
    let items = MOCK_COMPANIES.filter((v) => !search || v.name.toLowerCase().includes(search));
    if (status) items = items.filter((v) => v.status === status);
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.get('/api/companies/:id/', ({ params }) => {
    const item = MOCK_COMPANIES.find((v) => v.id === Number(params.id));
    return item ? HttpResponse.json({ code: 'OK', message: '', data: item }) : missing();
  }),
  http.post('/api/companies/', async ({ request }) => {
    const body = (await request.json()) as Create;
    const item = {
      id: Math.max(...MOCK_COMPANIES.map((v) => v.id)) + 1,
      ...body,
      status: body.status ?? 'active',
      created_at: new Date().toISOString(),
    };
    MOCK_COMPANIES.push(item);
    return HttpResponse.json({ code: 'OK', message: '', data: item }, { status: 201 });
  }),
  http.patch('/api/companies/:id/', async ({ params, request }) => {
    const item = MOCK_COMPANIES.find((v) => v.id === Number(params.id));
    if (!item) return missing();
    Object.assign(item, (await request.json()) as Update);
    return HttpResponse.json({ code: 'OK', message: '', data: item });
  }),
];
