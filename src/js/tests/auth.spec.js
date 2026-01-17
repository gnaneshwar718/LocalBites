import { test, expect } from '@playwright/test';
import { ROUTES } from '../../../route.js';

const SELECTORS = {
  CONTAINER: '#container',
  SIGN_UP_BTN: '#signUp',
  SIGN_IN_BTN: '#signIn',
  MOBILE_SIGN_UP_BTN: '#mobile-signUp',
  MOBILE_SIGN_IN_BTN: '#mobile-signIn',
  PANEL_ACTIVE: '.right-panel-active',
  SIGN_IN_FORM: '#signin-form',
  SIGN_UP_FORM: '#signup-form',
  SIGN_UP_NAME: '#signup-name',
  SIGN_UP_EMAIL: '#signup-email',
  SIGN_UP_PASSWORD: '#signup-password',
  SIGN_UP_RETYPE: '#signup-retype-password',
  SIGN_IN_EMAIL: '#signin-email',
  SIGN_IN_PASSWORD: '#signin-password',
  SUBMIT_BTN: 'button[type="submit"]',
  SIGN_UP_MESSAGE: '#signup-message',
  SIGN_IN_MESSAGE: '#signin-message',
};

test.describe('Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.AUTH);
  });

  test('should show sign in form by default', async ({ page }) => {
    await expect(page.locator(SELECTORS.CONTAINER)).toBeVisible();
    await expect(page.locator(SELECTORS.CONTAINER)).not.toHaveClass(
    );
    await expect(page.locator(SELECTORS.SIGN_IN_FORM)).toBeVisible();
  });

  test('should toggle between sign in and sign up panels', async ({ page }) => {
    await page.locator(SELECTORS.SIGN_UP_BTN).click();
    await expect(page.locator(SELECTORS.CONTAINER)).toHaveClass(
    );
    await page.locator(SELECTORS.SIGN_IN_BTN).click();
    await expect(page.locator(SELECTORS.CONTAINER)).not.toHaveClass(
    );
  });
  test('should show validation error for password mismatch', async ({
    page,
  }) => {
    await page.locator(SELECTORS.SIGN_UP_BTN).click();
    await page.locator(SELECTORS.SIGN_UP_NAME).fill('Test User');
    await page.locator(SELECTORS.SIGN_UP_EMAIL).fill('test@example.com');
    await page.locator(SELECTORS.SIGN_UP_PASSWORD).fill('password123');
    await page.locator(SELECTORS.SIGN_UP_RETYPE).fill('mismatch');
    await page
      .locator(SELECTORS.SIGN_UP_FORM)
      .locator(SELECTORS.SUBMIT_BTN)
      .click();
    const msg = page.locator(SELECTORS.SIGN_UP_MESSAGE);
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText('Passwords do not match!');
    await expect(msg).toHaveClass(/message-error/);
  });
  test('should handle successful signup', async ({ page }) => {
    await page.route('**/api/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Sign up successful' }),
      });
    });
    await page.locator(SELECTORS.SIGN_UP_BTN).click();
    await page.locator(SELECTORS.SIGN_UP_NAME).fill('New User');
    await page.locator(SELECTORS.SIGN_UP_EMAIL).fill('new@example.com');
    await page.locator(SELECTORS.SIGN_UP_PASSWORD).fill('password123');
    await page.locator(SELECTORS.SIGN_UP_RETYPE).fill('password123');
    await page
      .locator(SELECTORS.SIGN_UP_FORM)
      .locator(SELECTORS.SUBMIT_BTN)
      .click();
    const msg = page.locator(SELECTORS.SIGN_UP_MESSAGE);
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText('Sign up successful! Please sign in.');
    await expect(msg).toHaveClass(/message-success/);
    await expect(page.locator(SELECTORS.CONTAINER)).not.toHaveClass(
      /right-panel-active/,
      { timeout: 3000 }
    );
  });
  test('should handle failed signup', async ({ page }) => {
    await page.route('**/api/signup', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Email already exists' }),
      });
    });
    await page.locator(SELECTORS.SIGN_UP_BTN).click();
    await page.locator(SELECTORS.SIGN_UP_NAME).fill('Existing User');
    await page.locator(SELECTORS.SIGN_UP_EMAIL).fill('exist@example.com');
    await page.locator(SELECTORS.SIGN_UP_PASSWORD).fill('pass');
    await page.locator(SELECTORS.SIGN_UP_RETYPE).fill('pass');
    await page
      .locator(SELECTORS.SIGN_UP_FORM)
      .locator(SELECTORS.SUBMIT_BTN)
      .click();
    const msg = page.locator(SELECTORS.SIGN_UP_MESSAGE);
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText('Email already exists');
    await expect(msg).toHaveClass(/message-error/);
  });
  test('should handle successful signin', async ({ page }) => {
    await page.route('**/api/signin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Login Successful',
          user: { name: 'Test User' },
        }),
      });
    });
    await page.locator(SELECTORS.SIGN_IN_EMAIL).fill('user@example.com');
    await page.locator(SELECTORS.SIGN_IN_PASSWORD).fill('password123');
    await page
      .locator(SELECTORS.SIGN_IN_FORM)
      .locator(SELECTORS.SUBMIT_BTN)
      .click();
    const msg = page.locator(SELECTORS.SIGN_IN_MESSAGE);
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText(/Welcome back/i);
    await expect(msg).toHaveClass(/message-success/);
    await expect(page).toHaveURL(ROUTES.HOME, { timeout: 3000 });
  });
  test('should handle failed signin', async ({ page }) => {
    await page.route('**/api/signin', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });
    await page.locator(SELECTORS.SIGN_IN_EMAIL).fill('wrong@example.com');
    await page.locator(SELECTORS.SIGN_IN_PASSWORD).fill('wrongpass');
    await page
      .locator(SELECTORS.SIGN_IN_FORM)
      .locator(SELECTORS.SUBMIT_BTN)
      .click();
    const msg = page.locator(SELECTORS.SIGN_IN_MESSAGE);
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText('Invalid credentials');
    await expect(msg).toHaveClass(/message-error/);
  });
});
