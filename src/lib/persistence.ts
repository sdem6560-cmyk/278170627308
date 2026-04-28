export function readStorageString(key: string, fallback: string): string {
  const value = localStorage.getItem(key);
  return value ?? fallback;
}

export function readStorageJson<T>(key: string, fallback: T): T {
  const value = localStorage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`[persistence] Failed to parse JSON in key: ${key}`, error);
    return fallback;
  }
}

export function writeStorageJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
