import { http, HttpResponse } from 'msw';

const records = [
  {
    id: 801,
    class_date: '2026-07-21',
    theme: '肩颈舒展与呼吸',
    trainer_name: '张教练',
    session_number: 12,
    completion_rating: 4,
    improvement_tags: ['肩部放松', '呼吸节奏'],
    homework: '每日完成 2 组肩颈拉伸，每组 5 分钟。',
    has_feedback: true,
    trainer_notes: '动作控制稳定，右肩活动度较上周提升。',
    next_focus: '继续改善胸椎灵活性',
    poses: [
      { name: '猫牛式', duration_minutes: 6, notes: '配合完整呼吸' },
      { name: '穿针式', duration_minutes: 8, notes: '左右各两组' },
      { name: '婴儿式', duration_minutes: 5, notes: '放松肩背' },
    ],
    media: [],
  },
  {
    id: 802,
    class_date: '2026-07-17',
    theme: '核心稳定进阶',
    trainer_name: '张教练',
    session_number: 11,
    completion_rating: 5,
    improvement_tags: ['核心耐力'],
    homework: '隔天完成 3 组平板支撑，每组 30 秒。',
    has_feedback: false,
    trainer_notes: '核心控制显著提升，注意腰椎保持中立。',
    next_focus: '加入侧向稳定训练',
    poses: [
      { name: '平板式', duration_minutes: 8, notes: '保持骨盆中立' },
      { name: '船式', duration_minutes: 6, notes: '分三组完成' },
    ],
    media: [],
  },
  {
    id: 803,
    class_date: '2026-07-12',
    theme: '髋部灵活性',
    trainer_name: '张教练',
    session_number: 10,
    completion_rating: 4,
    improvement_tags: ['髋屈肌', '腿后侧'],
    homework: '睡前完成低弓步和半神猴式。',
    has_feedback: true,
    trainer_notes: '左侧髋屈肌偏紧，需保持循序渐进。',
    next_focus: '左右两侧平衡',
    poses: [
      { name: '低弓步', duration_minutes: 8, notes: '左侧适当延长' },
      { name: '半神猴式', duration_minutes: 8, notes: '避免膝关节锁死' },
    ],
    media: [],
  },
];

const plans = [
  {
    id: 701,
    title: '12 周肩颈与体态改善',
    trainer_name: '张教练',
    status: 'active',
    start_date: '2026-06-01',
    end_date: '2026-08-23',
    target_frequency_per_week: 2,
    completed_sessions_count: 12,
    progress_percentage: 58,
    goal_description: '缓解久坐肩颈紧张，改善胸椎活动度和日常体态。',
    focus_tags: ['肩颈', '胸椎', '呼吸'],
  },
  {
    id: 702,
    title: '春季基础体能恢复',
    trainer_name: '张教练',
    status: 'completed',
    start_date: '2026-03-01',
    end_date: '2026-05-25',
    target_frequency_per_week: 2,
    completed_sessions_count: 20,
    progress_percentage: 100,
    goal_description: '恢复规律训练习惯，建立基础核心力量。',
    focus_tags: ['基础体能', '核心'],
  },
];

const profile = {
  student_name: '李学员',
  phone: '13800000003',
  avatar_url: null,
  store_name: '瑜悦练 · 中心店',
  trainer_name: '张教练',
  joined_at: '2026-02-18',
  training_goals: ['改善肩颈不适', '提升核心力量', '每周稳定练习 2 次'],
  membership: {
    type_label: '24 次私教卡',
    status: 'active',
    expires_at: '2026-12-31',
    remaining_sessions: 9,
    balance_cents: null,
  },
  latest_assessment: {
    assessed_at: '2026-07-10',
    weight_kg: 55.8,
    body_fat_percentage: 24.6,
    flexibility_score: 78,
  },
};

const ok = (data: unknown) => HttpResponse.json({ code: 'OK', message: '', data });
const notFound = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '记录不存在', request_id: 'mock-student-self-service' },
    { status: 404 },
  );

export const studentSelfServiceHandlers = [
  http.get('/api/student/home/', () =>
    ok({
      generated_at: '2026-07-23T10:00:00+08:00',
      student_name: profile.student_name,
      next_class: {
        schedule_id: 102,
        course_name: '肩颈舒缓私教',
        trainer_name: '张教练',
        room_name: '云水教室',
        start_at: '2026-07-24T19:00:00+08:00',
      },
      stats: {
        completed_sessions: 12,
        attendance_rate: 0.92,
        current_streak_days: 18,
        active_plan_count: 1,
      },
      active_plan: plans[0],
      recent_record: records[0],
    }),
  ),
  http.get('/api/student/class-records/', ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(Number(url.searchParams.get('page')) || 1, 1);
    const pageSize = Math.max(Number(url.searchParams.get('page_size')) || 10, 1);
    const dateFrom = url.searchParams.get('date_from');
    const dateTo = url.searchParams.get('date_to');
    const filtered = records.filter(
      (record) =>
        (!dateFrom || record.class_date >= dateFrom) && (!dateTo || record.class_date <= dateTo),
    );
    const offset = (page - 1) * pageSize;
    return ok({
      items: filtered.slice(offset, offset + pageSize),
      page,
      page_size: pageSize,
      total: filtered.length,
    });
  }),
  http.get('/api/student/class-records/:id/', ({ params }) => {
    const item = records.find((record) => record.id === Number(params.id));
    return item ? ok(item) : notFound();
  }),
  http.get('/api/student/training-plans/', () => ok({ items: plans })),
  http.get('/api/student/training-plans/:id/', ({ params }) => {
    const item = plans.find((plan) => plan.id === Number(params.id));
    return item ? ok(item) : notFound();
  }),
  http.get('/api/student/profile/', () => ok(profile)),
];
