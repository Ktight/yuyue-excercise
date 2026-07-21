/**
 * 运行时配置。
 *
 * 集中读取 import.meta.env，页面和组件禁止直接访问环境变量。
 * 所有配置项在此处提供默认值和运行时验证。
 */

/** 当前运行模式：development | production | test */
export type AppMode = 'development' | 'production' | 'test';

export interface RuntimeConfig {
  /** 当前运行模式 */
  readonly mode: AppMode;
  /** API 基础路径 */
  readonly apiBaseUrl: string;
  /** 是否启用 MSW Mock */
  readonly enableMock: boolean;
  /** 应用标题 */
  readonly appTitle: string;
  /** 是否为生产环境 */
  readonly isProduction: boolean;
  /** 是否为开发环境 */
  readonly isDevelopment: boolean;
  /** 是否为测试环境 */
  readonly isTest: boolean;
}

function normalizeMode(mode: string): AppMode {
  if (mode === 'production') return 'production';
  if (mode === 'test') return 'test';
  return 'development';
}

export interface RuntimeConfigInput {
  mode: string;
  apiBaseUrl?: string;
  enableMock?: string;
  appTitle?: string;
}

export function createRuntimeConfig(input: RuntimeConfigInput): RuntimeConfig {
  const mode = normalizeMode(input.mode);
  const mockRequested = input.enableMock === 'true';

  if (mode === 'production' && mockRequested) {
    throw new Error('[runtime-config] 生产环境禁止启用 VITE_ENABLE_MOCK');
  }

  const config: RuntimeConfig = Object.freeze({
    mode,

    apiBaseUrl: input.apiBaseUrl || '/api',

    enableMock: mockRequested,

    appTitle: input.appTitle || '瑜悦练',

    isProduction: mode === 'production',
    isDevelopment: mode === 'development',
    isTest: mode === 'test',
  });

  return config;
}

/**
 * 全局运行时配置单例。
 *
 * 使用方式：
 *   import { config } from '@/shared/config';
 *   const url = `${config.apiBaseUrl}/auth/login`;
 */
export const config: RuntimeConfig = createRuntimeConfig({
  mode: import.meta.env.MODE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  enableMock: import.meta.env.VITE_ENABLE_MOCK,
  appTitle: import.meta.env.VITE_APP_TITLE,
});
