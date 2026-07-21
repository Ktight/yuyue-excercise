/**
 * Axios 响应拦截器：统一错误转换。
 *
 * 将后端错误响应转为 ApiError，网络异常转为 NetworkError。
 * 401 时不在此处跳转登录页（路由守卫负责），仅抛出结构化错误。
 */
import type { AxiosError } from 'axios';
import { ApiError, NetworkError } from './api-error';

/** Axios 错误响应的数据结构 */
interface ErrorResponseData {
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
  request_id?: string;
}

export function errorInterceptor(error: AxiosError<unknown>): Promise<never> {
  // 请求已发送但服务端返回错误状态码
  if (error.response) {
    const { status } = error.response;
    const data = error.response.data as ErrorResponseData | undefined;

    const code = data?.code ?? httpStatusToCode(status);
    const message = data?.message ?? httpStatusToMessage(status);
    const fieldErrors = data?.errors ?? {};
    const requestId = data?.request_id;

    return Promise.reject(new ApiError(status, code, message, fieldErrors, requestId));
  }

  // 请求已发送但没有响应（网络错误、超时、CORS）
  if (error.request) {
    const message =
      error.code === 'ECONNABORTED'
        ? '请求超时，请检查网络后重试'
        : '网络连接失败，请检查网络后重试';

    return Promise.reject(new NetworkError(message, error));
  }

  // 请求配置阶段就失败了
  return Promise.reject(new NetworkError('请求配置错误', error));
}

/** HTTP 状态码 → 默认错误码 */
function httpStatusToCode(status: number): string {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    case 429:
      return 'TOO_MANY_REQUESTS';
    default:
      return status >= 500 ? 'INTERNAL_ERROR' : 'UNKNOWN_ERROR';
  }
}

/** HTTP 状态码 → 默认提示 */
function httpStatusToMessage(status: number): string {
  switch (status) {
    case 400:
      return '请求参数有误';
    case 401:
      return '尚未登录或登录已过期';
    case 403:
      return '没有权限执行此操作';
    case 404:
      return '请求的资源不存在';
    case 409:
      return '操作冲突，请刷新后重试';
    case 422:
      return '请求数据校验失败';
    case 429:
      return '请求过于频繁，请稍后重试';
    default:
      return status >= 500 ? '服务器繁忙，请稍后重试' : '未知错误';
  }
}

/**
 * Token 刷新拦截器（骨架）。
 * 后续由认证模块（P01）实现完整刷新 → 重试逻辑。
 */
