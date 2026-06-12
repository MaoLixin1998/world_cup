/* 安全读取 JSON：localStorage 中的脏数据不能拖垮页面首屏。 */
export function readJsonFromStorage<T>(key: string): T | null {
  // localStorage.getItem 只会返回字符串或 null；浏览器不会帮我们自动转对象。
  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }

  try {
    // JSON.parse 把字符串转回对象。<T> 表示调用者期待这个对象是什么类型。
    return JSON.parse(storedValue) as T;
  } catch {
    // 如果字符串不是合法 JSON，直接返回 null，让上层决定怎么兜底。
    return null;
  }
}

/**
 * 把对象写入 localStorage。
 *
 * <p>localStorage 只能保存字符串，所以写入前必须先 JSON.stringify。
 */
export function writeJsonToStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
