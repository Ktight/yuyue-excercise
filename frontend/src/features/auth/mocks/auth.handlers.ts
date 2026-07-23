import { http, HttpResponse } from 'msw';
import {
  MOCK_LOGIN_RESPONSE,
  MOCK_REFRESH_RESPONSE,
  MOCK_REFRESH_TOKEN,
  MOCK_USER_ADMIN,
  MOCK_USER_TRAINER,
} from './auth.fixtures';

const errorBody = (code: string, message: string) => ({
  code,
  message,
  errors: {},
  request_id: 'req_mock',
});

export const authHandlers = [
  http.post('/api/auth/login/', async ({ request }) => {
    const body = (await request.json()) as { phone?: string; password?: string };
    if (
      body.password === '12345678' &&
      (body.phone === '13800000002' || body.phone === '13800000001')
    ) {
      const user = body.phone === MOCK_USER_ADMIN.phone ? MOCK_USER_ADMIN : MOCK_USER_TRAINER;
      return HttpResponse.json({
        code: 'OK',
        message: '登录成功',
        data: { ...MOCK_LOGIN_RESPONSE, user },
      });
    }
    return HttpResponse.json(errorBody('INVALID_CREDENTIALS', '手机号或密码错误'), {
      status: 401,
    });
  }),

  http.post('/api/auth/refresh/', async ({ request }) => {
    const body = (await request.json()) as { refresh_token?: string };
    if (body.refresh_token !== MOCK_REFRESH_TOKEN) {
      return HttpResponse.json(errorBody('REFRESH_TOKEN_INVALID', '刷新令牌无效'), { status: 401 });
    }
    return HttpResponse.json({ code: 'OK', message: '刷新成功', data: MOCK_REFRESH_RESPONSE });
  }),

  http.post('/api/auth/logout/', () =>
    HttpResponse.json({ code: 'OK', message: '退出成功', data: null }),
  ),

  http.get('/api/auth/me/', ({ request }) => {
    if (!request.headers.get('Authorization')) {
      return HttpResponse.json(errorBody('UNAUTHORIZED', '未登录'), { status: 401 });
    }
    return HttpResponse.json({ code: 'OK', message: '查询成功', data: MOCK_USER_TRAINER });
  }),

  http.patch('/api/auth/me/', async ({ request }) => {
    const body = (await request.json()) as { name?: string; avatar?: string | null };
    Object.assign(MOCK_USER_TRAINER, body);
    return HttpResponse.json({ code: 'OK', message: '保存成功', data: MOCK_USER_TRAINER });
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
