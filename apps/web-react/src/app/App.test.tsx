import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App shell", () => {
  beforeEach(() => {
    // 这个测试关注“已完成身份设置后的首页”，所以先准备一份本地身份信息。
    window.localStorage.setItem(
      "worldcup.fanIdentity",
      JSON.stringify({ uid: "mei-10", nickname: "小梅迷", avatarPlayerId: "messi" })
    );
  });

  it("renders the Chinese product title", () => {
    // 渲染根组件，模拟用户打开应用第一屏。
    render(<App />);

    // 用角色和中文标题查找元素，比按 class 查找更接近真实用户和无障碍体验。
    expect(screen.getByRole("heading", { name: "世界杯问答" })).toBeInTheDocument();
  });
});
