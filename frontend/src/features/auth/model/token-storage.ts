import { tokenManager, type TokenPair } from '@/shared/api';

export const tokenStorage = {
  getAccess(): string | null {
    return tokenManager.get();
  },

  getRefresh(): string | null {
    return tokenManager.getRefresh();
  },

  set(tokens: TokenPair): void {
    tokenManager.setPair(tokens);
  },

  remove(): void {
    tokenManager.clear();
  },
};
