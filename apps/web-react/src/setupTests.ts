// 扩展 Vitest 的 DOM 断言，例如 toBeInTheDocument、toBeVisible。
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// 每个测试结束后清理页面，避免上一个组件残留到下一个测试里。
afterEach(() => {
  cleanup();
});
