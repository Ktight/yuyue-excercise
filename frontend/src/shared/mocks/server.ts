import { setupServer } from 'msw/node';
import { healthHandlers } from './handlers';

/**
 * MSW Node 服务端实例，用于 Vitest 单元测试。
 * 每个测试文件可导入此实例进行独立配置。
 */
export const server = setupServer(...healthHandlers);
