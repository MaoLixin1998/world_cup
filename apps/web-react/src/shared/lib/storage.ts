/* 安全读取 JSON：localStorage 中的脏数据不能拖垮页面首屏。 */
export function readJsonFromStorage<T>(key: string): T | null {
  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return null;
  }
}

export function writeJsonToStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
