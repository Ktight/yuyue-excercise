import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 测试配置骨架。
 * 后续 E2E 测试用例放置在 tests/e2e/ 目录。
 *
 * 运行：npx playwright test
 * 首次使用需安装浏览器：npx playwright install chromium
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
