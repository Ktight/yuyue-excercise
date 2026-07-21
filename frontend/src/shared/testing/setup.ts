/// <reference types="vitest/globals" />

/**
 * Vitest 全局测试配置。
 * 每个测试文件运行前自动执行。
 */
import { server } from '@/shared/mocks/server';
import { afterAll, afterEach, beforeAll } from 'vitest';

// 启动 MSW 服务端 Mock
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// 每个测试后重置处理器，保证测试隔离
afterEach(() => server.resetHandlers());

// 所有测试结束后关闭
afterAll(() => server.close());
