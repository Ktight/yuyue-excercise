import { describe, expect, it } from 'vitest';
import { config, createRuntimeConfig } from './runtime-config';

describe('runtime-config', () => {
  it('provides default apiBaseUrl', () => {
    expect(createRuntimeConfig({ mode: 'test' }).apiBaseUrl).toBe('/api');
  });

  it('provides default appTitle', () => {
    expect(createRuntimeConfig({ mode: 'test' }).appTitle).toBe('瑜悦练');
  });

  it('keeps Mock disabled when no override is provided', () => {
    expect(createRuntimeConfig({ mode: 'test' }).enableMock).toBe(false);
  });

  it('enables Mock only when explicitly requested', () => {
    expect(createRuntimeConfig({ mode: 'development', enableMock: 'true' }).enableMock).toBe(true);
    expect(createRuntimeConfig({ mode: 'development', enableMock: 'false' }).enableMock).toBe(
      false,
    );
  });

  it('exports mode as string', () => {
    expect(['development', 'production', 'test']).toContain(config.mode);
  });

  it('identifies Vitest as the test environment', () => {
    // vitest runs with MODE=test
    expect(config.isTest).toBe(true);
    expect(config.isProduction).toBe(false);
  });

  it('rejects enabling Mock in production', () => {
    expect(() => createRuntimeConfig({ mode: 'production', enableMock: 'true' })).toThrow(
      '生产环境禁止启用',
    );
  });
});
