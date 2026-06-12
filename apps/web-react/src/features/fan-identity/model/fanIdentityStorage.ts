import { FanIdentity } from "./fanIdentityTypes";

const fanIdentityStorageKey = "worldcup.fanIdentity";

export function readFanIdentity(): FanIdentity | null {
  const storedValue = window.localStorage.getItem(fanIdentityStorageKey);
  if (!storedValue) {
    return null;
  }

  try {
    // localStorage 只能保存字符串，所以这里集中处理 JSON 解析失败的情况。
    return JSON.parse(storedValue) as FanIdentity;
  } catch {
    console.warn("读取本地球迷身份失败，将重新展示身份设置页");
    return null;
  }
}

export function saveFanIdentity(identity: FanIdentity) {
  window.localStorage.setItem(fanIdentityStorageKey, JSON.stringify(identity));
}
