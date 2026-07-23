import { http, HttpResponse } from 'msw';
export const reportsHandlers = [
  http.post('/api/reports/preview/', async ({ request }) => {
    const b = (await request.json()) as {
      student_id: number;
      range_start: string;
      range_end: string;
    };
    return HttpResponse.json({
      code: 'OK',
      message: '',
      data: {
        studentId: b.student_id,
        studentName: `演示学员 ${b.student_id}`,
        trainerName: '张教练',
        rangeStart: b.range_start,
        rangeEnd: b.range_end,
        generatedAt: new Date().toISOString(),
        trainingCount: 12,
        attendanceRate: 91.7,
        averageRating: 4.3,
        planProgress: 62,
        ratingTrend: [
          { date: '07-01', rating: 3 },
          { date: '07-08', rating: 4 },
          { date: '07-15', rating: 4 },
          { date: '07-22', rating: 5 },
        ],
        bodyMetrics: [
          { label: '体重', unit: 'kg', before: 60.2, after: 58.9 },
          { label: '体脂率', unit: '%', before: 28, after: 25.6 },
        ],
        feedbackCount: 8,
        feelingDistribution: [
          { label: '轻松', count: 2 },
          { label: '适中', count: 5 },
          { label: '吃力', count: 1 },
        ],
        feedbackHighlights: ['肩颈比之前放松。', '核心动作稳定性有所提升。'],
        trainerComments: '本阶段动作控制明显改善，下一阶段重点提升髋部灵活性与核心耐力。',
      },
    });
  }),
];
