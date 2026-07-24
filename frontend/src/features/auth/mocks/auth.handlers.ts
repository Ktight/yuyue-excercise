import { http, HttpResponse } from 'msw';
import {
  MOCK_LOGIN_RESPONSE,
  MOCK_REFRESH_RESPONSE,
  MOCK_REFRESH_TOKEN,
  MOCK_USER_ADMIN,
  MOCK_USER_COMPANY_ADMIN,
  MOCK_USER_STORE_MANAGER,
  MOCK_USER_STUDENT,
  MOCK_USER_TRAINER,
} from './auth.fixtures';

const mockUsers = [
  MOCK_USER_ADMIN,
  MOCK_USER_COMPANY_ADMIN,
  MOCK_USER_STORE_MANAGER,
  MOCK_USER_TRAINER,
  MOCK_USER_STUDENT,
];

function accessTokenFor(userId: number): string {
  return userId === MOCK_USER_TRAINER.id ? 'mock-access-token' : `mock-access-token:${userId}`;
}

function userFromAuthorization(request: Request) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (token === 'mock-access-token' || token === 'mock-refreshed-access-token') {
    return MOCK_USER_TRAINER;
  }
  const userId = Number(token?.split(':')[1]);
  return mockUsers.find((user) => user.id === userId) ?? MOCK_USER_TRAINER;
}

const errorBody = (code: string, message: string) => ({
  code,
  message,
  errors: {},
  request_id: 'req_mock',
});

export const authHandlers = [
  http.post('/api/auth/login/', async ({ request }) => {
    const body = (await request.json()) as { phone?: string; password?: string };
    const user = mockUsers.find((candidate) => candidate.phone === body.phone);
    if (body.password === '12345678' && user) {
      return HttpResponse.json({
        code: 'OK',
        message: '登录成功',
        data: {
          ...MOCK_LOGIN_RESPONSE,
          access_token: accessTokenFor(user.id),
          refresh_token:
            user.id === MOCK_USER_TRAINER.id
              ? MOCK_REFRESH_TOKEN
              : `${MOCK_REFRESH_TOKEN}:${user.id}`,
          user,
        },
      });
    }
    return HttpResponse.json(errorBody('INVALID_CREDENTIALS', '手机号或密码错误'), {
      status: 401,
    });
  }),

  http.post('/api/auth/refresh/', async ({ request }) => {
    const body = (await request.json()) as { refresh_token?: string };
    if (!body.refresh_token?.startsWith(MOCK_REFRESH_TOKEN)) {
      return HttpResponse.json(errorBody('REFRESH_TOKEN_INVALID', '刷新令牌无效'), { status: 401 });
    }
    const userId = Number(body.refresh_token.split(':')[1]);
    return HttpResponse.json({
      code: 'OK',
      message: '刷新成功',
      data: {
        ...MOCK_REFRESH_RESPONSE,
        access_token: Number.isFinite(userId)
          ? accessTokenFor(userId)
          : MOCK_REFRESH_RESPONSE.access_token,
        refresh_token: Number.isFinite(userId)
          ? `${MOCK_REFRESH_TOKEN}:${userId}`
          : MOCK_REFRESH_RESPONSE.refresh_token,
      },
    });
  }),

  http.post('/api/auth/logout/', () =>
    HttpResponse.json({ code: 'OK', message: '退出成功', data: null }),
  ),

  http.get('/api/auth/me/', ({ request }) => {
    if (!request.headers.get('Authorization')) {
      return HttpResponse.json(errorBody('UNAUTHORIZED', '未登录'), { status: 401 });
    }
    return HttpResponse.json({
      code: 'OK',
      message: '查询成功',
      data: userFromAuthorization(request),
    });
  }),

  http.patch('/api/auth/me/', async ({ request }) => {
    const body = (await request.json()) as { name?: string; avatar?: string | null };
    const user = userFromAuthorization(request);
    Object.assign(user, body);
    return HttpResponse.json({ code: 'OK', message: '保存成功', data: user });
  }),

  http.post('/api/auth/change-password/', async ({ request }) => {
    if (!request.headers.get('Authorization')) {
      return HttpResponse.json(errorBody('UNAUTHORIZED', '未登录'), { status: 401 });
    }
    const body = (await request.json()) as { old_password?: string };
    if (body.old_password !== '12345678') {
      return HttpResponse.json(errorBody('OLD_PASSWORD_INCORRECT', '原密码不正确'), {
        status: 400,
      });
    }
    return HttpResponse.json({ code: 'OK', message: '密码修改成功', data: null });
  }),
];
