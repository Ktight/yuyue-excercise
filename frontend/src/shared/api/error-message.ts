import { ApiError, NetworkError } from './api-error';

/** Preserve contract and network messages while keeping unexpected failures user-safe. */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError || error instanceof NetworkError ? error.message : fallback;
}
