import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFanIdentity, saveFanIdentity } from "./fanIdentityStorage";

describe("fanIdentityStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("saves and reads fan identity from local storage", () => {
    saveFanIdentity({ uid: "mei-10", nickname: "小梅迷", avatarPlayerId: "messi" });

    expect(readFanIdentity()).toEqual({ uid: "mei-10", nickname: "小梅迷", avatarPlayerId: "messi" });
  });

  it("returns null when stored json is broken", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    window.localStorage.setItem("worldcup.fanIdentity", "{broken");

    expect(readFanIdentity()).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith("读取本地球迷身份失败，将重新展示身份设置页");
  });
});
