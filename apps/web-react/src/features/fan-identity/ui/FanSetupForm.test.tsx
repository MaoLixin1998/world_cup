import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FanSetupForm } from "./FanSetupForm";

describe("FanSetupForm", () => {
  it("submits uid nickname and selected avatar", () => {
    const onSubmit = vi.fn();
    render(<FanSetupForm onSubmit={onSubmit} />);

    // 像真实用户一样填写表单，而不是直接调用组件内部函数。
    fireEvent.change(screen.getByLabelText("UID"), { target: { value: "mei-10" } });
    fireEvent.change(screen.getByLabelText("昵称"), { target: { value: "小梅迷" } });
    fireEvent.click(screen.getByRole("radio", { name: "哈兰德" }));
    fireEvent.click(screen.getByRole("button", { name: "进入世界杯问答" }));

    expect(onSubmit).toHaveBeenCalledWith({
      uid: "mei-10",
      nickname: "小梅迷",
      avatarPlayerId: "haaland"
    });
  });

  it("shows a clear Chinese validation message when uid is empty", () => {
    const onSubmit = vi.fn();
    render(<FanSetupForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("昵称"), { target: { value: "小梅迷" } });
    fireEvent.click(screen.getByRole("button", { name: "进入世界杯问答" }));

    expect(screen.getByText("UID 不能为空")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
