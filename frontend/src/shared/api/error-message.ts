import { ApiError, NetworkError } from './api-error';

/** Preserve contract and network messages while keeping unexpected failures user-safe. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.requestId ? `${error.message}（请求编号：${error.requestId}）` : error.message;
  }
  return error instanceof NetworkError ? error.message : fallback;
}
