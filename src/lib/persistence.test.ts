import assert from 'node:assert/strict';
import {
  readStorageJson,
  readStorageString,
  writeStorageJson,
  writeStorageString,
} from './persistence';

class MemoryStorage {
  private map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

function withStorage(testFn: (storage: MemoryStorage) => void) {
  const storage = new MemoryStorage();
  (globalThis as any).window = { localStorage: storage };
  testFn(storage);
  delete (globalThis as any).window;
}

withStorage((storage) => {
  const originalWarn = console.warn;
  console.warn = () => {};
  writeStorageString('plain', 'value-1');
  assert.equal(readStorageString('plain', 'fallback'), 'value-1');

  writeStorageJson('json', { ok: true, count: 4 });
  assert.deepEqual(readStorageJson('json', { ok: false, count: 0 }), {
    ok: true,
    count: 4,
  });

  storage.setItem('broken-json', '{ invalid json }');
  assert.deepEqual(readStorageJson('broken-json', { safe: true }), { safe: true });

  assert.equal(readStorageString('missing-string', 'fallback-string'), 'fallback-string');
  assert.deepEqual(readStorageJson('missing-json', { fallback: true }), { fallback: true });

  console.warn = originalWarn;
});

console.log('persistence tests passed');
