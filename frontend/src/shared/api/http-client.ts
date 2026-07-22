/**
 * Axios HTTP 客户端。
 *
 * 页面和组件只调用本模块暴露的方法，禁止直接使用 axios。
 * 所有请求经过 Token 注入和错误转换拦截器。
 */
import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/shared/config';
import { authInterceptor } from './auth-interceptor';
import { errorInterceptor } from './error-interceptor';
import { canRecoverSession, recoverSession } from './session-recovery';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _sessionRetry?: boolean;
}

const httpClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：注入 Token
httpClient.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));

// 响应拦截器：转换错误
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequestConfig | undefined;
    const url = request?.url ?? '';
    const isAuthEndpoint = url.includes('/auth/login/') || url.includes('/auth/refresh/');

    if (
      error.response?.status === 401 &&
      request &&
      !request._sessionRetry &&
      !isAuthEndpoint &&
      canRecoverSession()
    ) {
      request._sessionRetry = true;
      try {
        await recoverSession();
        return await httpClient.request(request);
      } catch {
        // The original structured 401 remains the public error.
      }
    }

    return errorInterceptor(error);
  },
);

export { httpClient };
