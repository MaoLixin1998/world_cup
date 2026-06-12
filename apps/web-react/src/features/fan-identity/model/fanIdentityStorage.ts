import { logger } from "../../../shared/lib/logger";
import { readJsonFromStorage, writeJsonToStorage } from "../../../shared/lib/storage";
import { FanIdentity } from "./fanIdentityTypes";

const fanIdentityStorageKey = "worldcup.fanIdentity";

export function readFanIdentity(): FanIdentity | null {
  const identity = readJsonFromStorage<FanIdentity>(fanIdentityStorageKey);
  if (!identity && window.localStorage.getItem(fanIdentityStorageKey)) {
    logger.warn("读取本地球迷身份失败，将重新展示身份设置页");
  }
  return identity;
}

export function saveFanIdentity(identity: FanIdentity) {
  writeJsonToStorage(fanIdentityStorageKey, identity);
}
