import { http, HttpResponse } from 'msw';
import { MOCK_STORES } from './stores.fixtures';

export const storesHandlers = [
  http.get('/api/stores/', ({ request }) => {
    const url = new URL(request.url);
    const companyId = url.searchParams.get('company_id');
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    let items = MOCK_STORES;
    if (companyId) items = items.filter((s) => s.company_id === Number(companyId));
    if (search) items = items.filter((s) => s.name.toLowerCase().includes(search));
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.get('/api/stores/:id/', ({ params }) => {
    const s = MOCK_STORES.find((x) => x.id === Number(params.id));
    return s
      ? HttpResponse.json({ code: 'OK', message: '', data: s })
      : HttpResponse.json({ code: 'NOT_FOUND', message: '门店不存在' }, { status: 404 });
  }),
  http.post('/api/stores/', async ({ request }) => {
    const body = (await request.json()) as { name?: string; company_id?: number; address?: string };
    if (!body.name?.trim())
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: '门店名称必填' },
        { status: 400 },
      );
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: {
        id: 3,
        name: body.name,
        company_id: body.company_id || 1,
        address: body.address ?? '',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }),
  http.patch('/api/stores/:id/', async ({ params, request }) => {
    const store = MOCK_STORES.find((item) => item.id === Number(params.id));
    if (!store)
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '门店不存在', errors: {}, request_id: 'req_mock' },
        { status: 404 },
      );
    Object.assign(store, await request.json());
    return HttpResponse.json({ code: 'OK', message: '更新成功', data: store });
  }),
  http.post('/api/stores/:id/:action/', ({ params }) => {
    const store = MOCK_STORES.find((item) => item.id === Number(params.id));
    if (!store)
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '门店不存在', errors: {}, request_id: 'req_mock' },
        { status: 404 },
      );
    const status = params.action === 'activate' ? 'active' : 'inactive';
    store.status = status;
    return HttpResponse.json({ code: 'OK', message: '操作成功', data: store });
  }),
];
