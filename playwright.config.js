// Automatische Tests für die Web-App (npm test). Startet einen lokalen Server und prüft
// die wichtigsten Abläufe in einem Handy-großen Chromium-Fenster.
const { defineConfig, devices } = require("@playwright/test");

const PORT = 4173;
module.exports = defineConfig({
  testDir: "tests",
  timeout: 60000,
  fullyParallel: true,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    ...devices["iPhone 13"],
    browserName: "chromium",
    baseURL: `http://localhost:${PORT}/`,
    serviceWorkers: "block",
    trace: "retain-on-failure"
  },
  webServer: {
    command: `python3 -m http.server ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI
  }
});
