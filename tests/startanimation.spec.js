// Startanimation: beim ersten Öffnen die volle Fassung mit „Überspringen“, danach nur noch kurz
const { test, expect } = require("./helpers");

test("Startanimation: volle Fassung überspringbar, danach kurz", async ({ page }) => {
  await page.goto("/?intro=full");
  await expect(page.locator("#splash")).toHaveClass(/play/);
  await expect(page.locator("#splash")).toHaveAttribute("style", /--k:\s*1/);
  expect(await page.evaluate(() => localStorage.getItem("offland-intro"))).toBe("1");
  await page.locator("#splash .sp-skip").click();
  await expect(page.locator("#splash")).toHaveCount(0, { timeout: 4000 });
  await expect(page.locator("#start")).toBeVisible();
  // Zweiter Start: Schnelldurchlauf ohne Knopf
  await page.goto("/");
  await expect(page.locator("#splash")).toHaveAttribute("style", /--k:\s*\.34/);
  await expect(page.locator("#splash .sp-skip")).toBeHidden();
  await expect(page.locator("#splash")).toHaveCount(0, { timeout: 8000 });
});
