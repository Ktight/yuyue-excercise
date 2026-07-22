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
    const active = url.searchParams.get('is_active');
    const storeId = url.searchParams.get('store_id');
    let filtered = MOCK_USERS;
    if (search)
      filtered = filtered.filter(
        (user) => user.name.includes(search) || user.phone.includes(search),
      );
    if (role) filtered = filtered.filter((user) => user.role === role);
    if (active) filtered = filtered.filter((user) => user.is_active === (active === 'true'));
    if (storeId) filtered = filtered.filter((user) => user.store_id === Number(storeId));
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

  http.get('/api/users/:id/', ({ params }) => {
    const user = MOCK_USERS.find((item) => item.id === Number(params.id));
    return user
      ? HttpResponse.json({ code: 'OK', message: '', data: user })
      : HttpResponse.json({ code: 'USER_NOT_FOUND', message: '用户不存在' }, { status: 404 });
  }),

  http.patch('/api/users/:id/', async ({ params, request }) => {
    const user = MOCK_USERS.find((item) => item.id === Number(params.id));
    if (!user)
      return HttpResponse.json({ code: 'USER_NOT_FOUND', message: '用户不存在' }, { status: 404 });
    const body = (await request.json()) as components['schemas']['UserUpdateRequest'];
    Object.assign(user, body, {
      store_id: body.store_id === undefined ? user.store_id : body.store_id,
      is_active: body.is_active === undefined ? user.is_active : body.is_active,
    });
    return HttpResponse.json({ code: 'OK', message: '更新成功', data: user });
  }),

  http.post('/api/users/:id/reset-password/', async ({ params, request }) => {
    const user = MOCK_USERS.find((item) => item.id === Number(params.id));
    if (!user)
      return HttpResponse.json({ code: 'USER_NOT_FOUND', message: '用户不存在' }, { status: 404 });
    const body = (await request.json()) as { new_password?: string };
    if (!body.new_password || body.new_password.length < 8)
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: '密码至少 8 位' },
        { status: 400 },
      );
    return HttpResponse.json({ code: 'OK', message: '密码重置成功', data: null });
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
