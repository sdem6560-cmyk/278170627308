function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeGetItem(key: string): string | null {
  if (!canUseStorage()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`[persistence] Failed to read key: ${key}`, error);
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[persistence] Failed to write key: ${key}`, error);
  }
}

export function readStorageString(key: string, fallback: string): string {
  const value = safeGetItem(key);
  return value ?? fallback;
}

export function writeStorageString(key: string, value: string): void {
  safeSetItem(key, value);
}

export function readStorageJson<T>(key: string, fallback: T): T {
  const value = safeGetItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`[persistence] Failed to parse JSON in key: ${key}`, error);
    return fallback;
  }
}

export function writeStorageJson<T>(key: string, value: T): void {
  safeSetItem(key, JSON.stringify(value));
}
