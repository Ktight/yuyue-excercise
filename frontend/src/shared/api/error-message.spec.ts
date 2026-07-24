import { describe, expect, it } from 'vitest';
import { ApiError, NetworkError } from './api-error';
import { getErrorMessage } from './error-message';

describe('getErrorMessage', () => {
  it('keeps the API message and request reference', () => {
    expect(getErrorMessage(new ApiError(409, 'CONFLICT', '数据冲突', {}, 'req-123'), '失败')).toBe(
      '数据冲突（请求编号：req-123）',
    );
  });

  it('keeps a network message and protects unexpected errors', () => {
    expect(getErrorMessage(new NetworkError('网络连接失败'), '失败')).toBe('网络连接失败');
    expect(getErrorMessage(new Error('internal detail'), '操作失败')).toBe('操作失败');
  });
});
