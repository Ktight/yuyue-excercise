import { describe, expect, it } from 'vitest';

describe('runtime-config', () => {
  it('provides default apiBaseUrl', async () => {
    // import.meta.env is available in vitest via vite
    const { config } = await import('./runtime-config');
    expect(config.apiBaseUrl).toBe('/api');
  });

  it('provides default appTitle', async () => {
    const { config } = await import('./runtime-config');
    expect(config.appTitle).toBe('瑜悦练');
  });

  it('enableMock is false by default', async () => {
    const { config } = await import('./runtime-config');
    expect(config.enableMock).toBe(false);
  });

  it('exports mode as string', async () => {
    const { config } = await import('./runtime-config');
    expect(['development', 'production', 'test']).toContain(config.mode);
  });

  it('isDevelopment is true in test environment', async () => {
    const { config } = await import('./runtime-config');
    // vitest runs with MODE=test
    expect(config.isTest).toBe(true);
    expect(config.isProduction).toBe(false);
  });

  it('rejects enabling Mock in production', async () => {
    const { createRuntimeConfig } = await import('./runtime-config');
    expect(() => createRuntimeConfig({ mode: 'production', enableMock: 'true' })).toThrow(
      '生产环境禁止启用',
    );
  });
});
