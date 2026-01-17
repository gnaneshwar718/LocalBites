import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { BASE_URL as CONSTANT_BASE_URL } from './src/js/constants/constants.js';
import { PLAYWRIGHT_CONFIG } from './src/js/constants/paths.js';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || CONSTANT_BASE_URL;

export default defineConfig({
  testDir: PLAYWRIGHT_CONFIG.TEST_DIR,
  testMatch: PLAYWRIGHT_CONFIG.TEST_MATCH,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
