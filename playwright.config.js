import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "**/*.spec.js",
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:5191", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 5191 --strictPort",
    url: "http://127.0.0.1:5191",
    reuseExistingServer: false,
  },
});
