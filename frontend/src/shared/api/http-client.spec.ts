import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { httpClient } from './http-client';
import { ApiError } from './api-error';
import { tokenManager } from './token-manager';
import { configureSessionRecovery } from './session-recovery';

describe('http-client', () => {
  afterEach(() => configureSessionRecovery(null));
  it('sends GET request and receives response data', async () => {
    server.use(
      http.get('/api/test-get', () => {
        return HttpResponse.json({ code: 'OK', message: '', data: { id: 1 } });
      }),
    );

    const response = await httpClient.get('/test-get');
    expect(response.data).toEqual({ code: 'OK', message: '', data: { id: 1 } });
  });

  it('sends POST request with body', async () => {
    server.use(
      http.post('/api/test-post', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ code: 'OK', message: '', data: body });
      }),
    );

    const response = await httpClient.post('/test-post', { name: 'test' });
    expect(response.data).toEqual({ code: 'OK', message: '', data: { name: 'test' } });
  });

  it('attaches Authorization header when token is set', async () => {
    tokenManager.set('test-token-123');

    let receivedAuth = '';
    server.use(
      http.get('/api/test-auth', ({ request }) => {
        receivedAuth = request.headers.get('Authorization') || '';
        return HttpResponse.json({ code: 'OK', message: '', data: null });
      }),
    );

    await httpClient.get('/test-auth');
    expect(receivedAuth).toBe('Bearer test-token-123');

    tokenManager.clear();
  });

  it('does not attach Authorization header when token is not set', async () => {
    tokenManager.clear();

    let receivedAuth = '';
    server.use(
      http.get('/api/test-no-auth', ({ request }) => {
        receivedAuth = request.headers.get('Authorization') || '';
        return HttpResponse.json({ code: 'OK', message: '', data: null });
      }),
    );

    await httpClient.get('/test-no-auth');
    expect(receivedAuth).toBe('');

    tokenManager.clear();
  });
});

describe('session recovery', () => {
  afterEach(() => {
    configureSessionRecovery(null);
    tokenManager.clear();
  });

  it('shares one recovery attempt across concurrent 401 responses', async () => {
    let recoveryCount = 0;
    configureSessionRecovery(async () => {
      recoveryCount += 1;
      await Promise.resolve();
      tokenManager.set('renewed-token');
    });
    server.use(
      http.get('/api/recoverable', ({ request }) => {
        return request.headers.get('Authorization') === 'Bearer renewed-token'
          ? HttpResponse.json({ code: 'OK', message: '', data: true })
          : HttpResponse.json({ code: 'AUTH_UNAUTHORIZED', message: 'expired' }, { status: 401 });
      }),
    );

    const responses = await Promise.all([
      httpClient.get('/recoverable'),
      httpClient.get('/recoverable'),
    ]);
    expect(recoveryCount).toBe(1);
    expect(responses.every((response) => response.data.data === true)).toBe(true);
  });
});

describe('http-client error handling', () => {
  it('transforms 400 to ApiError', async () => {
    server.use(
      http.get('/api/test-400', () => {
        return HttpResponse.json(
          { code: 'INVALID_INPUT', message: '输入校验失败', errors: { name: ['必填'] } },
          { status: 400 },
        );
      }),
    );

    try {
      await httpClient.get('/test-400');
      expect.fail('Expected ApiError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      const apiError = error as ApiError;
      expect(apiError.httpStatus).toBe(400);
      expect(apiError.code).toBe('INVALID_INPUT');
      expect(apiError.isValidationError).toBe(true);
      expect(apiError.fieldMessage('name')).toBe('必填');
    }
  });

  it('transforms 401 to ApiError', async () => {
    server.use(
      http.get('/api/test-401', () => {
        return HttpResponse.json({ code: 'UNAUTHORIZED', message: '未登录' }, { status: 401 });
      }),
    );

    try {
      await httpClient.get('/test-401');
      expect.fail('Expected ApiError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isUnauthorized).toBe(true);
    }
  });

  it('transforms 403 to ApiError', async () => {
    server.use(
      http.get('/api/test-403', () => {
        return HttpResponse.json(null, { status: 403 });
      }),
    );

    try {
      await httpClient.get('/test-403');
      expect.fail('Expected ApiError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isForbidden).toBe(true);
    }
  });

  it('transforms 409 to ApiError', async () => {
    server.use(
      http.get('/api/test-409', () => {
        return HttpResponse.json(null, { status: 409 });
      }),
    );

    try {
      await httpClient.get('/test-409');
      expect.fail('Expected ApiError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isConflict).toBe(true);
    }
  });

  it('transforms 500 to ApiError with isServerError', async () => {
    server.use(
      http.get('/api/test-500', () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );

    try {
      await httpClient.get('/test-500');
      expect.fail('Expected ApiError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isServerError).toBe(true);
      expect((error as ApiError).httpStatus).toBe(500);
    }
  });
});
