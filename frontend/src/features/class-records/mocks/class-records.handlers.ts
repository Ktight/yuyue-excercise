import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
type S = components['schemas'];
const now = '2026-07-23T09:00:00+08:00',
  seq = {
    warmup: [{ name: '猫牛式', duration: 5, notes: '', variations: '', assists: '' }],
    main: [{ name: '下犬式', duration: 8, notes: '', variations: '', assists: '' }],
    cooldown: [{ name: '挺尸式', duration: 6, notes: '', variations: '', assists: '' }],
  };
const items: S['ClassRecord'][] = [
  {
    id: 1,
    company: 1,
    attendance: 1,
    attendance_status: 'present',
    schedule: 1,
    student: 5,
    student_name: '演示学员',
    trainer: 4,
    trainer_name: '演示教练',
    store: 1,
    plan: null,
    class_date: '2026-07-23',
    theme: '肩颈舒缓',
    session_number: 1,
    pose_sequence: seq,
    trainer_notes: '完成良好',
    homework: '每日呼吸练习',
    completion_rating: 4,
    improvement_tags: ['肩颈'],
    next_focus: '稳定性',
    status: 'draft',
    media: [],
    created_at: now,
    updated_at: now,
  },
];
const ok = <T>(data: T, status = 200) =>
    HttpResponse.json({ code: 'OK', message: '', data }, { status }),
  miss = () => HttpResponse.json({ code: 'NOT_FOUND', message: '课堂记录不存在' }, { status: 404 });
export const classRecordsHandlers = [
  http.get('/api/class-records/', () => ok({ items, page: 1, page_size: 20, total: items.length })),
  http.get('/api/class-records/:id/', ({ params }) => {
    const x = items.find((v) => v.id === Number(params.id));
    return x ? ok(x) : miss();
  }),
  http.post('/api/class-records/', async ({ request }) => {
    const b = (await request.json()) as S['ClassRecordCreateRequest'];
    const base = items[0];
    if (!base) return miss();
    const x: S['ClassRecord'] = {
      ...base,
      id: items.length + 1,
      attendance: b.attendance_id,
      theme: b.theme,
      pose_sequence: b.pose_sequence,
      trainer_notes: b.trainer_notes ?? '',
      homework: b.homework ?? '',
      completion_rating: b.completion_rating ?? null,
      improvement_tags: b.improvement_tags ?? [],
      next_focus: b.next_focus ?? '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    items.push(x);
    return ok(x, 201);
  }),
  http.patch('/api/class-records/:id/', async ({ params, request }) => {
    const x = items.find((v) => v.id === Number(params.id));
    if (!x) return miss();
    Object.assign(x, await request.json(), { updated_at: new Date().toISOString() });
    return ok(x);
  }),
  http.post('/api/class-records/:id/complete/', ({ params }) => {
    const index = items.findIndex((v) => v.id === Number(params.id));
    if (index < 0) return miss();
    const current = items[index];
    if (!current) return miss();
    const completed: S['ClassRecord'] = { ...current, status: 'completed' };
    items.splice(index, 1, completed);
    return ok(completed);
  }),
  http.post('/api/training/batch-records/', () => ok({ created_count: 1, items: [items[0]] }, 201)),
  http.post('/api/upload/', () =>
    ok(
      {
        file_url: 'https://example.com/class.jpg',
        thumbnail_url: 'https://example.com/class-thumb.jpg',
      },
      201,
    ),
  ),
  http.get('/api/class-records/:id/media/', ({ params }) => {
    const record = items.find((value) => value.id === Number(params.id));
    return record
      ? ok({ items: record.media, page: 1, page_size: 20, total: record.media.length })
      : miss();
  }),
  http.post('/api/class-records/:id/media/', async ({ params, request }) => {
    const record = items.find((value) => value.id === Number(params.id));
    if (!record) return miss();
    const body = (await request.json()) as S['ClassMediaCreateRequest'];
    const media: S['ClassMedia'] = {
      id: record.media.length + 1,
      class_record: record.id,
      media_type: body.media_type,
      file_url: body.file_url,
      thumbnail_url: body.thumbnail_url ?? '',
      caption: body.caption ?? '',
      annotations: body.annotations ?? null,
      sort_order: body.sort_order ?? 0,
    };
    (record.media as S['ClassMedia'][]).push(media);
    return ok(media, 201);
  }),
  http.delete('/api/class-records/:recordId/media/:mediaId/', ({ params }) => {
    const record = items.find((value) => value.id === Number(params.recordId));
    if (!record) return miss();
    const index = record.media.findIndex((value) => value.id === Number(params.mediaId));
    if (index < 0) return miss();
    (record.media as S['ClassMedia'][]).splice(index, 1);
    return ok({});
  }),
];
