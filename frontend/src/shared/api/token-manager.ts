const ACCESS_TOKEN_KEY = 'yuyuelian_access_token';
const REFRESH_TOKEN_KEY = 'yuyuelian_refresh_token';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const tokenManager = {
  get(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefresh(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  set(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  setPair(tokens: TokenPair): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
