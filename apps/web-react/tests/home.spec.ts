import { expect, test } from "@playwright/test";

test("first-time fan can set identity and enter the app", async ({ page }) => {
  // 访问应用根路径，模拟用户第一次打开世界杯问答前端；先清空本地身份，确保测试稳定。
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  // 首次进入应该先看到身份设置页，而不是直接进入问答首页。
  await expect(page.getByRole("heading", { name: "先设置你的球迷身份" })).toBeVisible();

  await page.getByLabel("UID").fill("fan-001");
  await page.getByLabel("昵称").fill("小梅迷");
  await page.getByRole("radio", { name: "哈兰德" }).check();
  await page.getByRole("button", { name: "进入世界杯问答" }).click();

  // 提交后进入应用壳，说明 localStorage 保存和 React 状态切换都生效。
  await expect(page.getByRole("heading", { name: "世界杯问答" })).toBeVisible();
});
