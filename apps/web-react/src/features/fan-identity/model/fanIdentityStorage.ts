import { logger } from "../../../shared/lib/logger";
import { readJsonFromStorage, writeJsonToStorage } from "../../../shared/lib/storage";
import { FanIdentity } from "./fanIdentityTypes";

// localStorage 是浏览器自带的“小型本地存储”。
// 这个 key 是我们保存球迷身份时使用的固定名字。
const fanIdentityStorageKey = "worldcup.fanIdentity";

/**
 * 从浏览器本地读取球迷身份。
 *
 * <p>返回值是 FanIdentity 或 null：
 * - 有合法数据：返回身份对象；
 * - 没保存过或数据坏了：返回 null，让 App 显示身份设置页。
 */
export function readFanIdentity(): FanIdentity | null {
  const identity = readJsonFromStorage<FanIdentity>(fanIdentityStorageKey);
  // 如果 localStorage 里明明有值，但解析出来是 null，说明旧数据坏了，需要记录一条提醒日志。
  if (!identity && window.localStorage.getItem(fanIdentityStorageKey)) {
    logger.warn("读取本地球迷身份失败，将重新展示身份设置页");
  }
  return identity;
}

/**
 * 把球迷身份保存到浏览器本地。
 *
 * <p>这样用户刷新页面后，仍然可以直接进入首页，不需要每次都重新填写。
 */
export function saveFanIdentity(identity: FanIdentity) {
  writeJsonToStorage(fanIdentityStorageKey, identity);
}
