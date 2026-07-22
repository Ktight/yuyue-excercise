import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_ASSESSMENTS, type MockAssessment } from './body-assessments.fixtures';
type Create = components['schemas']['BodyAssessmentCreateRequest'];
type Update = components['schemas']['BodyAssessmentUpdateRequest'];
const ok = <T>(data: T, status = 200) =>
  HttpResponse.json({ code: 'OK', message: '', data }, { status });
const missing = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '评估不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );
export const bodyAssessmentsHandlers = [
  http.get('/api/body-assessments/', ({ request }) => {
    const url = new URL(request.url),
      studentId = Number(url.searchParams.get('student_id')) || undefined;
    const items = MOCK_ASSESSMENTS.filter((item) => !studentId || item.student === studentId);
    return ok({ items, page: 1, page_size: 20, total: items.length });
  }),
  http.post('/api/body-assessments/', async ({ request }) => {
    const body = (await request.json()) as Create;
    const item: MockAssessment = {
      id: Math.max(0, ...MOCK_ASSESSMENTS.map((value) => value.id)) + 1,
      student: body.student,
      assess_date: body.assess_date,
      height: body.height ?? null,
      weight: body.weight ?? null,
      posture_spine: body.posture_spine ?? '',
      posture_pelvis: body.posture_pelvis ?? '',
      posture_shoulder: body.posture_shoulder ?? '',
      flexibility_score: body.flexibility_score ?? null,
      core_strength_score: body.core_strength_score ?? null,
      photos: [],
      notes: body.notes ?? '',
      created_at: new Date().toISOString(),
    };
    MOCK_ASSESSMENTS.push(item);
    return ok(item, 201);
  }),
  http.get('/api/body-assessments/:id/', ({ params }) => {
    const item = MOCK_ASSESSMENTS.find((value) => value.id === Number(params.id));
    return item ? ok(item) : missing();
  }),
  http.patch('/api/body-assessments/:id/', async ({ params, request }) => {
    const item = MOCK_ASSESSMENTS.find((value) => value.id === Number(params.id));
    if (!item) return missing();
    const body = (await request.json()) as Update;
    Object.assign(item, body);
    return ok(item);
  }),
  http.delete('/api/body-assessments/:id/', ({ params }) => {
    const index = MOCK_ASSESSMENTS.findIndex((value) => value.id === Number(params.id));
    if (index < 0) return missing();
    MOCK_ASSESSMENTS.splice(index, 1);
    return ok({});
  }),
  http.get('/api/students/:id/body-assessment-trend/', ({ params, request }) => {
    const metric = (new URL(request.url).searchParams.get('metric') || 'weight') as
      'height' | 'weight' | 'flexibility_score' | 'core_strength_score';
    const items = MOCK_ASSESSMENTS.filter((value) => value.student === Number(params.id));
    const points = items.flatMap((item) => {
      const value = item[metric];
      return value === null
        ? []
        : [{ assessment_id: item.id, assess_date: item.assess_date, value }];
    });
    return ok({
      student_id: Number(params.id),
      metric,
      unit: metric === 'height' ? 'cm' : metric === 'weight' ? 'kg' : 'score_1_10',
      has_trend: points.length >= 2,
      points,
    });
  }),
];
