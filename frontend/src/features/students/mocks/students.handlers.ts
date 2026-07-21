import { http, HttpResponse } from 'msw';
import { MOCK_STUDENTS } from './students.fixtures';

export const studentsHandlers = [
  http.get('/api/students', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const mtype = url.searchParams.get('membership_type');
    let items = MOCK_STUDENTS;
    if (search)
      items = items.filter(
        (s) => s.name.toLowerCase().includes(search) || s.phone.includes(search),
      );
    if (mtype) items = items.filter((s) => s.membership_type === mtype);
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.get('/api/students/:id', ({ params }) => {
    const s = MOCK_STUDENTS.find((x) => x.id === params.id);
    return s
      ? HttpResponse.json({ code: 'OK', message: '', data: s })
      : HttpResponse.json({ code: 'NOT_FOUND', message: '学员不存在' }, { status: 404 });
  }),
  http.post('/api/students', async ({ request }) => {
    const body = (await request.json()) as { name?: string; phone?: string };
    if (!body.name?.trim())
      return HttpResponse.json({ code: 'VALIDATION_ERROR', message: '姓名必填' }, { status: 400 });
    if (body.phone && MOCK_STUDENTS.some((s) => s.phone === body.phone))
      return HttpResponse.json(
        {
          code: 'STUDENT_PHONE_EXISTS',
          message: '该手机号已存在',
          errors: { phone: ['手机号已存在'] },
        },
        { status: 409 },
      );
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: {
        id: `stu-new-${Date.now()}`,
        name: body.name,
        phone: body.phone || '',
        membership_type: 'none',
        created_at: new Date().toISOString(),
      } as (typeof MOCK_STUDENTS)[number],
    });
  }),
  http.put('/api/students/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const s = MOCK_STUDENTS.find((x) => x.id === params.id);
    if (!s) return HttpResponse.json({ code: 'NOT_FOUND', message: '学员不存在' }, { status: 404 });
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { ...s, ...body } as (typeof MOCK_STUDENTS)[number],
    });
  }),
];
