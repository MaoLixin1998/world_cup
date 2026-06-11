import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Vite 插件：让 Vite 能理解 React 的 JSX/TSX 语法和快速刷新。
  plugins: [react()],
  test: {
    // jsdom 模拟浏览器 DOM，让组件测试可以在 Node 环境里运行。
    environment: "jsdom",
    // 测试启动前加载 jest-dom，获得 toBeInTheDocument 等更贴近 UI 的断言。
    setupFiles: "./src/setupTests.ts"
  }
});
