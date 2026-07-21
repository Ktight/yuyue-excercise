/**
 * API 层公开出口。
 *
 * 页面和组件应从此处导入 HTTP 客户端和错误类型：
 *   import { httpClient, ApiError } from '@/shared/api';
 */
export { httpClient } from './http-client';
export { ApiError, NetworkError } from './api-error';
export { tokenManager } from './token-manager';
export type { TokenPair } from './token-manager';
