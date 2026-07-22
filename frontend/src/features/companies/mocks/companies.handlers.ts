import { http, HttpResponse } from 'msw';
import { MOCK_COMPANIES } from './companies.fixtures';

export const companiesHandlers = [
  http.get('/api/companies/', ({ request }) => {
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
  http.get('/api/companies/:id/', ({ params }) => {
    const c = MOCK_COMPANIES.find((x) => x.id === Number(params.id));
    return c
      ? HttpResponse.json({ code: 'OK', message: '', data: c })
      : HttpResponse.json({ code: 'NOT_FOUND', message: '公司不存在' }, { status: 404 });
  }),
  http.post('/api/companies/', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      address?: string;
      contact_name?: string;
      contact_phone?: string;
    };
    if (!body.name?.trim()) {
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: '公司名称必填' },
        { status: 400 },
      );
    }
    const newCompany: (typeof MOCK_COMPANIES)[number] = {
      id: 3,
      name: body.name,
      address: body.address ?? '',
      contact_name: body.contact_name ?? '',
      contact_phone: body.contact_phone ?? '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json({ code: 'OK', message: '', data: newCompany });
  }),
  http.patch('/api/companies/:id/', async ({ params, request }) => {
    const body = (await request.json()) as { name?: string };
    const c = MOCK_COMPANIES.find((x) => x.id === Number(params.id));
    if (!c) return HttpResponse.json({ code: 'NOT_FOUND', message: '公司不存在' }, { status: 404 });
    Object.assign(c, body);
    return HttpResponse.json({ code: 'OK', message: '', data: c });
  }),
  http.post('/api/companies/:id/:action/', ({ params }) => {
    const company = MOCK_COMPANIES.find((item) => item.id === Number(params.id));
    if (!company)
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '公司不存在', errors: {}, request_id: 'req_mock' },
        { status: 404 },
      );
    const status = params.action === 'activate' ? 'active' : 'inactive';
    company.status = status;
    return HttpResponse.json({ code: 'OK', message: '操作成功', data: company });
  }),
];
