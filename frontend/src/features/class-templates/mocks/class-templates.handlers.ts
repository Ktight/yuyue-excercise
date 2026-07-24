import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
type S = components['schemas'];
const items: S['ClassTemplate'][] = [
  {
    id: 1,
    company: 1,
    trainer: 4,
    trainer_name: '演示教练',
    name: '肩颈舒缓模板',
    scope: 'company_shared',
    course_template: 1,
    course_template_name: '流瑜伽基础',
    pose_sequence: {
      warmup: [{ name: '猫牛式', duration: 5, notes: '', variations: '', assists: '' }],
      main: [{ name: '下犬式', duration: 8, notes: '', variations: '', assists: '' }],
      cooldown: [{ name: '挺尸式', duration: 6, notes: '', variations: '', assists: '' }],
    },
    notes_template: '关注呼吸节奏。',
    is_active: true,
    created_at: '2026-07-22T10:00:00+08:00',
    updated_at: '2026-07-22T10:00:00+08:00',
  },
];
const ok = <T>(data: T, status = 200) =>
  HttpResponse.json({ code: 'OK', message: '', data }, { status });
export const classTemplatesHandlers = [
  http.get('/api/class-templates/', ({ request }) => {
    const u = new URL(request.url),
      scope = u.searchParams.get('scope');
    const filtered = scope ? items.filter((x) => x.scope === scope) : items;
    return ok({ items: filtered, page: 1, page_size: 20, total: filtered.length });
  }),
  http.get('/api/class-templates/:id/', ({ params }) => {
    const item = items.find((x) => x.id === Number(params.id));
    return item
      ? ok(item)
      : HttpResponse.json({ code: 'NOT_FOUND', message: '模板不存在' }, { status: 404 });
  }),
  http.post('/api/class-templates/', async ({ request }) => {
    const b = (await request.json()) as S['ClassTemplateCreateRequest'];
    const now = new Date().toISOString();
    const item: S['ClassTemplate'] = {
      id: items.length + 1,
      company: 1,
      trainer: b.trainer,
      trainer_name: 'Mock 教练',
      name: b.name,
      scope: b.scope,
      course_template: b.course_template ?? null,
      course_template_name: null,
      pose_sequence: b.pose_sequence,
      notes_template: b.notes_template ?? '',
      is_active: b.is_active ?? true,
      created_at: now,
      updated_at: now,
    };
    items.push(item);
    return ok(item, 201);
  }),
  http.patch('/api/class-templates/:id/', async ({ params, request }) => {
    const item = items.find((x) => x.id === Number(params.id));
    if (!item)
      return HttpResponse.json({ code: 'NOT_FOUND', message: '模板不存在' }, { status: 404 });
    Object.assign(item, await request.json(), { updated_at: new Date().toISOString() });
    return ok(item);
  }),
  http.delete('/api/class-templates/:id/', ({ params }) => {
    const index = items.findIndex((x) => x.id === Number(params.id));
    if (index < 0)
      return HttpResponse.json({ code: 'NOT_FOUND', message: '模板不存在' }, { status: 404 });
    items.splice(index, 1);
    return ok({});
  }),
];
