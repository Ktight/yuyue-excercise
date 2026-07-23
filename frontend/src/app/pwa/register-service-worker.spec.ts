import { describe, expect, it } from 'vitest';
import { registerServiceWorker } from './register-service-worker';

describe('service worker registration', () => {
  it('is a no-op outside production', async () => {
    await expect(registerServiceWorker()).resolves.toBeUndefined();
  });
});
