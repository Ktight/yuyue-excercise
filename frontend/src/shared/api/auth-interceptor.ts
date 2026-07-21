/**
 * Axios 请求拦截器：注入认证 Token。
 *
 * 在每个请求的 Authorization 头附加 Bearer token。
 * 无 token 时跳过（允许匿名请求如登录）。
 */
import type { InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from './token-manager';

export function authInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = tokenManager.get();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}
