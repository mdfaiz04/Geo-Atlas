// Single place that reads and writes the auth tokens kept in the browser.
const ACCESS_TOKEN_KEY = 'darukaa.accessToken';
const REFRESH_TOKEN_KEY = 'darukaa.refreshToken';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

// Returns the saved access token, or null when storage is empty or blocked.
export function readAccessToken(): string | null {
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

// Persists both tokens, ignoring browsers that refuse to store them.
export function saveTokens(tokens: StoredTokens): void {
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } catch {
    return;
  }
}

// Removes every stored token so the next visit starts signed out.
export function clearTokens(): void {
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    return;
  }
}
