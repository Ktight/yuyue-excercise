import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
type S = components['schemas'];
const now = '2026-07-23T10:00:00+08:00';
const items: S['TrainingPlan'][] = [
  {
    id: 1,
    company: 1,
    student: 1,
    student_name: '演示学员',
    trainer: 4,
    trainer_name: '演示教练',
    title: '12 周体态改善计划',
    start_date: '2026-07-01',
    end_date: '2026-09-22',
    target_frequency_per_week: 2,
    goal_description: '改善肩颈紧张并提升核心稳定',
    focus_tags: ['肩颈', '核心'],
    status: 'active',
    completed_sessions_count: 3,
    progress_percentage: 12.5,
    created_at: now,
    updated_at: now,
  },
];
const ok = <T>(data: T, status = 200) =>
    HttpResponse.json({ code: 'OK', message: '', data }, { status }),
  miss = () => HttpResponse.json({ code: 'NOT_FOUND', message: '训练计划不存在' }, { status: 404 });
export const trainingPlansHandlers = [
  http.get('/api/training-plans/', ({ request }) => {
    const q = new URL(request.url).searchParams,
      status = q.get('status'),
      student = Number(q.get('student_id') || 0),
      trainer = Number(q.get('trainer_id') || 0);
    const filtered = items.filter(
      (x) =>
        (!status || x.status === status) &&
        (!student || x.student === student) &&
        (!trainer || x.trainer === trainer),
    );
    return ok({ items: filtered, page: 1, page_size: 20, total: filtered.length });
  }),
  http.post('/api/training-plans/', async ({ request }) => {
    const b = (await request.json()) as S['TrainingPlanCreateRequest'];
    const x: S['TrainingPlan'] = {
      id: Math.max(...items.map((x) => x.id)) + 1,
      company: 1,
      student: b.student,
      student_name: `学员 ${b.student}`,
      trainer: 4,
      trainer_name: '演示教练',
      title: b.title,
      start_date: b.start_date,
      end_date: b.end_date,
      target_frequency_per_week: b.target_frequency_per_week,
      goal_description: b.goal_description,
      focus_tags: b.focus_tags,
      status: b.status,
      completed_sessions_count: 0,
      progress_percentage: 0,
      created_at: now,
      updated_at: now,
    };
    items.push(x);
    return ok(x, 201);
  }),
  http.get('/api/training-plans/:id/', ({ params }) => {
    const x = items.find((v) => v.id === Number(params.id));
    return x
      ? ok({ ...x, linked_records: { items: [], page: 1, page_size: 20, total: 0 } })
      : miss();
  }),
  http.patch('/api/training-plans/:id/', async ({ params, request }) => {
    const x = items.find((v) => v.id === Number(params.id));
    if (!x) return miss();
    const b = (await request.json()) as S['TrainingPlanUpdateRequest'];
    Object.assign(x, b, { updated_at: new Date().toISOString() });
    return ok(x);
  }),
  http.delete('/api/training-plans/:id/', ({ params }) => {
    const i = items.findIndex((v) => v.id === Number(params.id));
    if (i < 0) return miss();
    items.splice(i, 1);
    return new HttpResponse(null, { status: 204 });
  }),
  http.post('/api/training-plans/:id/complete/', ({ params }) => {
    const x = items.find((v) => v.id === Number(params.id));
    if (!x) return miss();
    x.status = 'completed';
    return ok(x);
  }),
  http.post('/api/training-plans/:id/pause/', ({ params }) => {
    const x = items.find((v) => v.id === Number(params.id));
    if (!x) return miss();
    x.status = 'paused';
    return ok(x);
  }),
];
