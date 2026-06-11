import { defineConfig } from "@playwright/test";

export default defineConfig({
  // 只收集 tests/ 目录下的浏览器端 e2e 测试，避免误执行 src 里的组件单测。
  testDir: "./tests",
  webServer: {
    // e2e 测试前自动启动 Vite dev server，避免手动开服务。
    // 这里显式使用 /Users/mao/tools 下的 pnpm shim，避免 PATH 中其它 pnpm 版本干扰。
    command:
      "COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm exec vite --host 127.0.0.1 --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true
  },
  use: {
    // 使用本机已安装的 Google Chrome，避免额外下载 Playwright 浏览器二进制。
    channel: "chrome",
    // 测试里的 page.goto("/") 会基于这个地址访问本地页面。
    baseURL: "http://127.0.0.1:5173"
  }
});
