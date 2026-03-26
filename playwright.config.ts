import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 1,
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3098",
    headless: true,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npx next start --port 3098",
    port: 3098,
    timeout: 30000,
    reuseExistingServer: true,
  },
});
