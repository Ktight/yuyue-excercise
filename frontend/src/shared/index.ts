/**
 * 共享基础设施公开出口。
 * 外部只能从此 index.ts 导入，禁止深层导入。
 */

// 运行时配置
export { config } from './config';
export type { AppMode, RuntimeConfig } from './config';

// HTTP 客户端
export { httpClient, ApiError, NetworkError, tokenManager } from './api';

// Mock Service Worker
export { worker } from './mocks/browser';
export { server } from './mocks/server';
export { healthHandlers } from './mocks/handlers';
export { toLocalDateInputValue } from './date';
