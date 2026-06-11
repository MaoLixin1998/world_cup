import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App shell", () => {
  it("renders the Chinese product title", () => {
    // 渲染根组件，模拟用户打开应用第一屏。
    render(<App />);

    // 用角色和中文标题查找元素，比按 class 查找更接近真实用户和无障碍体验。
    expect(screen.getByRole("heading", { name: "世界杯问答" })).toBeInTheDocument();
  });
});
