import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
type S = components['schemas'];

const items: S['Feedback'][] = [
  {
    id: 1,
    company: 1,
    class_record: 1,
    class_record_summary: {
      id: 1,
      class_date: '2026-07-23',
      theme: '核心稳定',
      trainer: { id: 2, name: '张教练' },
    },
    student: { id: 3, name: '演示学员', avatar: null },
    feeling: 'moderate',
    improvement_note: '肩颈比上周放松',
    comment: '核心动作仍需要继续练习。',
    photos: [],
    is_editable: false,
    created_at: '2026-07-23T11:00:00+08:00',
    updated_at: '2026-07-23T11:00:00+08:00',
  },
];
const ok = <T>(data: T, status = 200) =>
  HttpResponse.json({ code: 'OK', message: '', data }, { status });

export const feedbackHandlers = [
  http.get('/api/feedback/', ({ request }) => {
    const query = new URL(request.url).searchParams;
    const recordId = Number(query.get('class_record_id'));
    const filtered = items.filter((item) => !recordId || item.class_record === recordId);
    return ok({ items: filtered, page: 1, page_size: 20, total: filtered.length });
  }),
  http.post('/api/feedback/', async ({ request }) => {
    const body = (await request.json()) as S['FeedbackCreateRequest'];
    if (items.some((item) => item.class_record === body.class_record)) {
      return HttpResponse.json(
        { code: 'FEEDBACK_ALREADY_EXISTS', message: '该课时已经提交过反馈', errors: {} },
        { status: 409 },
      );
    }
    const now = new Date().toISOString();
    const item: S['Feedback'] = {
      id: Math.max(0, ...items.map((value) => value.id)) + 1,
      company: 1,
      class_record: body.class_record,
      class_record_summary: {
        id: body.class_record,
        class_date: '2026-07-23',
        theme: '训练课程',
        trainer: { id: 2, name: '张教练' },
      },
      student: { id: 3, name: '当前学员', avatar: null },
      feeling: body.feeling,
      improvement_note: body.improvement_note ?? '',
      comment: body.comment ?? '',
      photos: [],
      is_editable: false,
      created_at: now,
      updated_at: now,
    };
    items.push(item);
    return ok(item, 201);
  }),
];
