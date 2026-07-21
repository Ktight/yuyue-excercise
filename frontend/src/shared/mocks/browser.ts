import { setupWorker } from 'msw/browser';
import { healthHandlers } from './handlers';

/**
 * MSW 浏览器 Worker 实例，用于本地开发。
 * 仅在 VITE_ENABLE_MOCK=true 时由 main.ts 启动。
 */
export const worker = setupWorker(...healthHandlers);
