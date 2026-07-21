import { http, HttpResponse } from 'msw';
import { MOCK_ASSESSMENTS } from './body-assessments.fixtures';
import type { BodyAssessmentDto } from '@/features/body-assessments/model';

export const bodyAssessmentsHandlers = [
  http.get('/api/body-assessments', ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('student_id') || '';
    const items = MOCK_ASSESSMENTS[studentId] || [];
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: { items, page: 1, page_size: 20, total: items.length },
    });
  }),
  http.post('/api/body-assessments', async ({ request }) => {
    const body = (await request.json()) as { height?: number; weight?: number };
    if (!body.height || !body.weight)
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: '身高体重必填' },
        { status: 400 },
      );
    const bmi = Math.round((body.weight / (body.height / 100) ** 2) * 10) / 10;
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: {
        id: `ba-new-${Date.now()}`,
        student_id: '',
        height: body.height,
        weight: body.weight,
        bmi,
        assessed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as BodyAssessmentDto,
    });
  }),
];
