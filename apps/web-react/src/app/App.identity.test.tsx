import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App fan identity flow", () => {
  beforeEach(() => {
    // 每个测试前清空浏览器本地存储，避免上一个测试留下身份信息。
    window.localStorage.clear();
  });

  it("asks first-time visitors to set their fan identity", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "先设置你的球迷身份" })).toBeInTheDocument();
  });

  it("stores fan identity locally and then shows the app shell", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("UID"), { target: { value: "mei-10" } });
    fireEvent.change(screen.getByLabelText("昵称"), { target: { value: "小梅迷" } });
    fireEvent.click(screen.getByRole("radio", { name: "梅西" }));
    fireEvent.click(screen.getByRole("button", { name: "进入世界杯问答" }));

    expect(screen.getByRole("heading", { name: "世界杯问答" })).toBeInTheDocument();
    expect(window.localStorage.getItem("worldcup.fanIdentity")).toContain("小梅迷");
  });
});
