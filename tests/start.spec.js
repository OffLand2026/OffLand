// Startbildschirm: Mr. Bay und Lucifer unterhalten sich
const { test, expect } = require("./helpers");

test("Mr. Bay und Lucifer reden abwechselnd", async ({ page }) => {
  await page.goto("/");
  const bub = page.locator("#startBub");
  await expect(bub).toContainText("Mr. Bay");
  // Allererster Start: Die Intro-Szene bleibt als Hintergrund stehen, Lucifer mit Herzchenbrille
  await expect(page.locator("#start.first .st-world .bay-wave")).toHaveCount(1);
  await expect(page.locator("#start.first .st-world .luc-tail")).toHaveCount(1);
  await expect(page.locator("#start.first .st-world #stHearts")).toHaveCount(1);
  await expect(page.locator("#start.first .st-sheet #newAcc")).toBeVisible();
  // Nach dem Intro fängt das Gespräch wieder bei Mr. Bay an, Lucifer antwortet knapp 4 s später
  await expect(page.locator("#splash")).toHaveCount(0, { timeout: 8000 });
  await expect(bub).toContainText("Lucifer", { timeout: 9000 });
});

test("Mit vorhandener Insel: Inselbild als Ziel des Übergangs, Lucifer mit Herzchenbrille", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("offline-insel-profile", JSON.stringify([{ id: "p1", name: "Ida", avatar: "Ziege", salt: "s", pin: null, created: 1 }])));
  await page.reload();
  await expect(page.locator("#start.sky .start-hero .st-sand")).toHaveCount(1);
  await expect(page.locator('#start .start-hero [fill="#FF6FA8"]')).toHaveCount(1);
  await expect(page.locator("#start.first")).toHaveCount(0);
  await expect(page.locator("#splash")).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator("[data-login]")).toContainText("Ida");
});
