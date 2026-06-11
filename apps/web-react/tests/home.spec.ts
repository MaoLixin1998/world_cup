import { expect, test } from "@playwright/test";

test("home page is visible", async ({ page }) => {
  // 访问应用根路径，模拟用户第一次打开世界杯问答前端。
  await page.goto("/");

  // 检查中文标题可见，证明页面已被 Vite 正常渲染到浏览器。
  await expect(page.getByRole("heading", { name: "世界杯问答" })).toBeVisible();
});
