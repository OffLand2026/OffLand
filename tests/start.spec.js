// Startbildschirm: Mr. Bay und Lucifer unterhalten sich
const { test, expect } = require("./helpers");

test("Mr. Bay und Lucifer reden abwechselnd", async ({ page }) => {
  await page.goto("/");
  const bub = page.locator("#startBub");
  await expect(bub).toContainText("Mr. Bay");
  await expect(page.locator(".start-hero .bay-wave")).toHaveCount(1);
  await expect(page.locator(".start-hero .luc-tail")).toHaveCount(1);
  await expect(bub).toContainText("Lucifer", { timeout: 6000 });
});
