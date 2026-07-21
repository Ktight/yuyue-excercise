import { http, HttpResponse } from 'msw';
import type { components } from '@/generated/api-types';
import { MOCK_USERS } from './users.fixtures';

export const usersHandlers = [
  http.get('/api/users/', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const role = url.searchParams.get('role');
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('page_size')) || 20;
    let filtered = MOCK_USERS;
    if (search)
      filtered = filtered.filter(
        (user) => user.name.includes(search) || user.phone.includes(search),
      );
    if (role) filtered = filtered.filter((user) => user.role === role);
    return HttpResponse.json({
      code: 'OK',
      message: '查询成功',
      data: {
        items: filtered.slice((page - 1) * pageSize, page * pageSize),
        page,
        page_size: pageSize,
        total: filtered.length,
      },
    });
  }),

  http.post('/api/users/', async ({ request }) => {
    const body = (await request.json()) as components['schemas']['UserCreateRequest'];
    if (body.phone === '13800000001') {
      return HttpResponse.json(
        {
          code: 'PHONE_ALREADY_EXISTS',
          message: '该手机号已被注册',
          errors: { phone: ['手机号已存在'] },
          request_id: 'req_mock',
        },
        { status: 409 },
      );
    }
    return HttpResponse.json({
      code: 'OK',
      message: '创建成功',
      data: {
        id: 6,
        name: body.name,
        phone: body.phone,
        role: body.role,
        avatar: null,
        company_id: 1,
        store_id: body.store_id ?? null,
        is_active: body.is_active ?? true,
      },
    });
  }),
];
