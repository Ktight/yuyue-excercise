import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_STUDENTS, type MockStudent } from './students.fixtures';

type Create = components['schemas']['StudentCreateRequest'];
type Update = components['schemas']['StudentUpdateRequest'];
type MembershipUpdate = components['schemas']['MembershipUpdateRequest'];
const ok = <T>(data: T, status = 200) =>
  HttpResponse.json({ code: 'OK', message: '', data }, { status });
const missing = () =>
  HttpResponse.json(
    { code: 'NOT_FOUND', message: '学员不存在', errors: {}, request_id: 'req_mock' },
    { status: 404 },
  );

export const studentsHandlers = [
  http.get('/api/students/', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const status = url.searchParams.get('status'),
      membership = url.searchParams.get('membership_status');
    const page = Number(url.searchParams.get('page')) || 1,
      pageSize = Number(url.searchParams.get('page_size')) || 20;
    const items = MOCK_STUDENTS.filter(
      (item) =>
        (!search ||
          item.user.name.toLowerCase().includes(search) ||
          item.user.phone.includes(search)) &&
        (!status || item.status === status) &&
        (!membership ||
          (membership === 'valid'
            ? item.member_card_status.is_valid
            : !item.member_card_status.is_valid)),
    );
    return ok({
      items: items.slice((page - 1) * pageSize, page * pageSize),
      page,
      page_size: pageSize,
      total: items.length,
    });
  }),
  http.get('/api/students/:id/', ({ params }) => {
    const item = MOCK_STUDENTS.find((value) => value.id === Number(params.id));
    return item ? ok(item) : missing();
  }),
  http.post('/api/students/', async ({ request }) => {
    const body = (await request.json()) as Create;
    const now = new Date().toISOString();
    const item: MockStudent = {
      id: Math.max(0, ...MOCK_STUDENTS.map((value) => value.id)) + 1,
      user: {
        id: Date.now(),
        name: body.user.name,
        phone: body.user.phone,
        avatar: null,
        is_active: true,
      },
      company: 1,
      home_store: body.home_store,
      primary_trainer: body.primary_trainer ?? null,
      gender: body.gender,
      birth_date: body.birth_date ?? null,
      emergency_contact: body.emergency_contact,
      member_card_type: body.member_card_type,
      member_card_start: body.member_card_start,
      member_card_expire: body.member_card_expire,
      member_card_balance: body.member_card_balance,
      member_card_active: body.member_card_active,
      member_card_status: { status: 'active', is_valid: true, reason: '' },
      health_notes: body.health_notes,
      injury_history: body.injury_history,
      contraindications: body.contraindications,
      training_goal: body.training_goal,
      preferred_style: body.preferred_style,
      recent_assessment: null,
      status: 'active',
      created_at: now,
      updated_at: now,
    };
    MOCK_STUDENTS.push(item);
    return ok(item, 201);
  }),
  http.patch('/api/students/:id/', async ({ params, request }) => {
    const item = MOCK_STUDENTS.find((value) => value.id === Number(params.id));
    if (!item) return missing();
    const body = (await request.json()) as Update;
    Object.assign(item, {
      home_store: body.home_store ?? item.home_store,
      primary_trainer:
        body.primary_trainer === undefined ? item.primary_trainer : body.primary_trainer,
      gender: body.gender ?? item.gender,
      birth_date: body.birth_date === undefined ? item.birth_date : body.birth_date,
      emergency_contact: body.emergency_contact ?? item.emergency_contact,
      health_notes: body.health_notes ?? item.health_notes,
      injury_history: body.injury_history ?? item.injury_history,
      contraindications: body.contraindications ?? item.contraindications,
      training_goal: body.training_goal ?? item.training_goal,
      preferred_style: body.preferred_style ?? item.preferred_style,
      updated_at: new Date().toISOString(),
    });
    return ok(item);
  }),
  http.get('/api/students/:id/membership/', ({ params }) => {
    const item = MOCK_STUDENTS.find((value) => value.id === Number(params.id));
    return item
      ? ok({
          card_type: item.member_card_type,
          status: item.member_card_status.status,
          starts_on: item.member_card_start,
          expires_on: item.member_card_expire,
          remaining_count: item.member_card_type === 'count' ? item.member_card_balance : null,
          balance_minor: item.member_card_type === 'stored' ? item.member_card_balance : null,
          active: item.member_card_active,
        })
      : missing();
  }),
  http.patch('/api/students/:id/membership/', async ({ params, request }) => {
    const item = MOCK_STUDENTS.find((value) => value.id === Number(params.id));
    if (!item) return missing();
    const body = (await request.json()) as MembershipUpdate;
    item.member_card_type = body.card_type ?? item.member_card_type;
    item.member_card_start = body.starts_on ?? item.member_card_start;
    item.member_card_expire = body.expires_on ?? item.member_card_expire;
    item.member_card_active = body.active ?? item.member_card_active;
    item.member_card_balance =
      body.remaining_count ?? body.balance_minor ?? item.member_card_balance;
    return ok({
      card_type: item.member_card_type,
      status: item.member_card_status.status,
      starts_on: item.member_card_start,
      expires_on: item.member_card_expire,
      remaining_count: item.member_card_type === 'count' ? item.member_card_balance : null,
      balance_minor: item.member_card_type === 'stored' ? item.member_card_balance : null,
      active: item.member_card_active,
    });
  }),
  http.get('/api/students/:id/eligibility/', ({ params }) =>
    MOCK_STUDENTS.some((value) => value.id === Number(params.id))
      ? ok({
          is_eligible: true,
          can_book: true,
          can_check_in: true,
          can_consume: true,
          reason_code: 'ELIGIBLE',
          reason: '',
        })
      : missing(),
  ),
];
