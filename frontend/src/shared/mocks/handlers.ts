import { http, HttpResponse } from 'msw';

/**
 * 全局 MSW 请求处理器。
 * 初始为空数组，后续按功能逐步注册。
 *
 * 添加方式（按功能）：
 *   import { handlers as authHandlers } from '@/features/auth/mocks/auth.handlers';
 *   handlers.push(...authHandlers);
 */
export const healthHandlers = [
  // 健康检查占位（后端未就绪时返回 200）
  http.get('/api/health', () => {
    return HttpResponse.json({ code: 'OK', message: '', data: { status: 'ok' } });
  }),
];
