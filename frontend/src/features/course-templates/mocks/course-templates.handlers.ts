import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_TEMPLATES, type MockCourseTemplate } from './course-templates.fixtures';

type CreateRequest = components['schemas']['CourseTemplateCreateRequest'];
type UpdateRequest = components['schemas']['CourseTemplateUpdateRequest'];

function notFound() {
  return HttpResponse.json(
    { code: 'NOT_FOUND', message: '课程模板不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );
}

export const courseTemplatesHandlers = [
  http.get('/api/course-templates/', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim().toLowerCase() ?? '';
    const category = url.searchParams.get('category');
    const difficulty = url.searchParams.get('difficulty');
    const status = url.searchParams.get('status');
    const companyId = Number(url.searchParams.get('company_id')) || undefined;
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.max(1, Number(url.searchParams.get('page_size')) || 20);
    let items = [...MOCK_TEMPLATES];
    if (search) items = items.filter((item) => item.name.toLowerCase().includes(search));
    if (category) items = items.filter((item) => item.category === category);
    if (difficulty) items = items.filter((item) => item.difficulty === difficulty);
    if (status) items = items.filter((item) => item.status === status);
    if (companyId) items = items.filter((item) => item.company === companyId);
    const total = items.length;
    items = items.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page, page_size: pageSize, total },
    });
  }),
  http.get('/api/course-templates/:id/', ({ params }) => {
    const template = MOCK_TEMPLATES.find((item) => item.id === Number(params.id));
    return template ? HttpResponse.json({ code: 'OK', message: '', data: template }) : notFound();
  }),
  http.post('/api/course-templates/', async ({ request }) => {
    const body = (await request.json()) as CreateRequest;
    if (body.category === 'private' && body.max_capacity !== 1) {
      return HttpResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: '请求参数校验失败',
          errors: { max_capacity: ['私教课容量必须为 1'] },
          request_id: 'req_mock',
        },
        { status: 400 },
      );
    }
    const now = new Date().toISOString();
    const template: MockCourseTemplate = {
      id: Math.max(...MOCK_TEMPLATES.map((item) => item.id), 0) + 1,
      company: 1,
      ...body,
      cover_image: '',
      status: body.status ?? 'active',
      created_at: now,
      updated_at: now,
    };
    MOCK_TEMPLATES.push(template);
    return HttpResponse.json({ code: 'OK', message: '', data: template }, { status: 201 });
  }),
  http.patch('/api/course-templates/:id/', async ({ params, request }) => {
    const template = MOCK_TEMPLATES.find((item) => item.id === Number(params.id));
    if (!template) return notFound();
    const body = (await request.json()) as UpdateRequest;
    const category = body.category ?? template.category;
    const capacity = body.max_capacity ?? template.max_capacity;
    if (category === 'private' && capacity !== 1) {
      return HttpResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: '请求参数校验失败',
          errors: { max_capacity: ['私教课容量必须为 1'] },
          request_id: 'req_mock',
        },
        { status: 400 },
      );
    }
    Object.assign(template, body, { updated_at: new Date().toISOString() });
    return HttpResponse.json({ code: 'OK', message: '', data: template });
  }),
  http.delete('/api/course-templates/:id/', ({ params }) => {
    const index = MOCK_TEMPLATES.findIndex((item) => item.id === Number(params.id));
    if (index < 0) return notFound();
    MOCK_TEMPLATES.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
