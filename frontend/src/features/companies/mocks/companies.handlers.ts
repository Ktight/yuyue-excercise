import { http, HttpResponse } from 'msw';
import { MOCK_COMPANIES } from './companies.fixtures';

export const companiesHandlers = [
  http.get('/api/companies', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const items = search
      ? MOCK_COMPANIES.filter((c) => c.name.toLowerCase().includes(search))
      : MOCK_COMPANIES;
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.get('/api/companies/:id', ({ params }) => {
    const c = MOCK_COMPANIES.find((x) => x.id === params.id);
    return c
      ? HttpResponse.json({ code: 'OK', message: '', data: c })
      : HttpResponse.json({ code: 'NOT_FOUND', message: '公司不存在' }, { status: 404 });
  }),
  http.post('/api/companies', async ({ request }) => {
    const body = (await request.json()) as { name?: string };
    if (!body.name?.trim()) {
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: '公司名称必填' },
        { status: 400 },
      );
    }
    const newCompany: (typeof MOCK_COMPANIES)[number] = {
      id: `c-new-${Date.now()}`,
      name: body.name,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json({ code: 'OK', message: '', data: newCompany });
  }),
  http.put('/api/companies/:id', async ({ params, request }) => {
    const body = (await request.json()) as { name?: string };
    const c = MOCK_COMPANIES.find((x) => x.id === params.id);
    if (!c) return HttpResponse.json({ code: 'NOT_FOUND', message: '公司不存在' }, { status: 404 });
    return HttpResponse.json({ code: 'OK', message: '', data: { ...c, ...body } });
  }),
];
