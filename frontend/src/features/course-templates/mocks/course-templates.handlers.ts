import { http, HttpResponse } from 'msw';
import { MOCK_TEMPLATES } from './course-templates.fixtures';

export const courseTemplatesHandlers = [
  http.get('/api/course-templates', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    let items = MOCK_TEMPLATES;
    if (search) items = items.filter((t) => t.name.toLowerCase().includes(search));
    if (category) items = items.filter((t) => t.category === category);
    if (status) items = items.filter((t) => t.status === status);
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.get('/api/course-templates/:id', ({ params }) => {
    const t = MOCK_TEMPLATES.find((x) => x.id === params.id);
    return t
      ? HttpResponse.json({ code: 'OK', message: '', data: t })
      : HttpResponse.json({ code: 'NOT_FOUND', message: '模板不存在' }, { status: 404 });
  }),
  http.post('/api/course-templates', async ({ request }) => {
    const body = (await request.json()) as { name?: string; category?: string };
    if (!body.name?.trim())
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: '课程名称必填' },
        { status: 400 },
      );
    if (body.category === 'personal' && (body as { capacity?: number }).capacity !== 1) {
      return HttpResponse.json(
        { code: 'INVALID_CAPACITY', message: '私教课程容量必须为 1' },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: {
        id: `ct-new-${Date.now()}`,
        name: body.name,
        category: body.category || 'yoga',
        duration_minutes: 60,
        difficulty: 'beginner',
        capacity: (body as { capacity?: number }).capacity || 20,
        status: 'active',
        created_at: new Date().toISOString(),
      } as (typeof MOCK_TEMPLATES)[number],
    });
  }),
  http.put('/api/course-templates/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const t = MOCK_TEMPLATES.find((x) => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'NOT_FOUND', message: '模板不存在' }, { status: 404 });
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { ...t, ...body } as (typeof MOCK_TEMPLATES)[number],
    });
  }),
  http.patch('/api/course-templates/:id/status', async ({ params, request }) => {
    const body = (await request.json()) as { status?: string };
    const t = MOCK_TEMPLATES.find((x) => x.id === params.id);
    if (!t) return HttpResponse.json({ code: 'NOT_FOUND', message: '模板不存在' }, { status: 404 });
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { ...t, status: body.status || t.status } as (typeof MOCK_TEMPLATES)[number],
    });
  }),
];
