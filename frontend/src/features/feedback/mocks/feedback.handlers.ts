import { http, HttpResponse } from 'msw';

interface FeedbackWire {
  id: number;
  class_record_id: number;
  student_name: string;
  feeling: 'easy' | 'moderate' | 'hard';
  comment: string;
  photo_urls: string[];
  can_edit: boolean;
  created_at: string;
  updated_at: string;
}

const items: FeedbackWire[] = [
  {
    id: 1,
    class_record_id: 1,
    student_name: '演示学员',
    feeling: 'moderate',
    comment: '肩颈比上周放松，核心动作仍需要继续练习。',
    photo_urls: [],
    can_edit: true,
    created_at: '2026-07-23T11:00:00+08:00',
    updated_at: '2026-07-23T11:00:00+08:00',
  },
];

const ok = <T>(data: T, status = 200) =>
  HttpResponse.json({ code: 'OK', message: '', data }, { status });

export const feedbackHandlers = [
  http.get('/api/feedback/', ({ request }) => {
    const id = Number(new URL(request.url).searchParams.get('class_record_id'));
    const filtered = items.filter((item) => !id || item.class_record_id === id);
    return ok({ items: filtered, page: 1, page_size: 20, total: filtered.length });
  }),
  http.post('/api/student/feedback/', async ({ request }) => {
    const body = (await request.json()) as Omit<
      FeedbackWire,
      'id' | 'student_name' | 'can_edit' | 'created_at' | 'updated_at'
    >;
    if (items.some((item) => item.class_record_id === body.class_record_id)) {
      return HttpResponse.json(
        { code: 'FEEDBACK_ALREADY_EXISTS', message: '该课时已经提交过反馈', errors: {} },
        { status: 409 },
      );
    }
    const now = new Date().toISOString();
    const item: FeedbackWire = {
      ...body,
      id: Math.max(0, ...items.map((value) => value.id)) + 1,
      student_name: '当前学员',
      can_edit: true,
      created_at: now,
      updated_at: now,
    };
    items.push(item);
    return ok(item, 201);
  }),
];
