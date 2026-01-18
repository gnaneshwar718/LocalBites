import { test, expect } from '@playwright/test';
import { ROUTES } from '../../../route.js';
import { TEST_USER, AUTH_SELECTORS } from '../constants/test-constants.js';

async function fillSignUpForm(page, { name, email, password, retypePassword }) {
  await page.locator(AUTH_SELECTORS.SIGN_UP_BTN).click();
  await page.locator(AUTH_SELECTORS.SIGN_UP_NAME).fill(name);
  await page.locator(AUTH_SELECTORS.SIGN_UP_EMAIL).fill(email);
  await page.locator(AUTH_SELECTORS.SIGN_UP_PASSWORD).fill(password);
  await page.locator(AUTH_SELECTORS.SIGN_UP_RETYPE).fill(retypePassword);
  await page
    .locator(AUTH_SELECTORS.SIGN_UP_FORM)
    .locator(AUTH_SELECTORS.SUBMIT_BTN)
    .click();
}

async function fillSignUpWithTestUser(page) {
  await fillSignUpForm(page, {
    name: TEST_USER.name,
    email: TEST_USER.email,
    password: TEST_USER.password,
    retypePassword: TEST_USER.password,
  });
}

test.describe('Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.AUTH);
  });

  test('should show sign in form by default', async ({ page }) => {
    await expect(page.locator(AUTH_SELECTORS.CONTAINER)).toBeVisible();
    await expect(page.locator(AUTH_SELECTORS.CONTAINER)).not.toHaveClass(
      /right-panel-active/
    );
    await expect(page.locator(AUTH_SELECTORS.SIGN_IN_FORM)).toBeVisible();
  });

  test('should toggle between sign in and sign up panels', async ({ page }) => {
    await page.locator(AUTH_SELECTORS.SIGN_UP_BTN).click();
    await expect(page.locator(AUTH_SELECTORS.CONTAINER)).toHaveClass(
      /right-panel-active/
    );
    await page.locator(AUTH_SELECTORS.SIGN_IN_BTN).click();
    await expect(page.locator(AUTH_SELECTORS.CONTAINER)).not.toHaveClass(
      /right-panel-active/
    );
  });
  test('should show validation error for password mismatch', async ({
    page,
  }) => {
    await fillSignUpForm(page, {
      name: TEST_USER.name,
      email: TEST_USER.email,
      password: TEST_USER.password,
      retypePassword: 'mismatch',
    });

    const msg = page.locator(AUTH_SELECTORS.SIGN_UP_MESSAGE);
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
    await fillSignUpWithTestUser(page);

    const msg = page.locator(AUTH_SELECTORS.SIGN_UP_MESSAGE);
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText('Sign up successful! Please sign in.');
    await expect(msg).toHaveClass(/message-success/);
    await expect(page.locator(AUTH_SELECTORS.CONTAINER)).not.toHaveClass(
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
    await fillSignUpWithTestUser(page);

    const msg = page.locator(AUTH_SELECTORS.SIGN_UP_MESSAGE);
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
    await page.locator(AUTH_SELECTORS.SIGN_IN_EMAIL).fill(TEST_USER.email);
    await page
      .locator(AUTH_SELECTORS.SIGN_IN_PASSWORD)
      .fill(TEST_USER.password);
    await page
      .locator(AUTH_SELECTORS.SIGN_IN_FORM)
      .locator(AUTH_SELECTORS.SUBMIT_BTN)
      .click();
    const msg = page.locator(AUTH_SELECTORS.SIGN_IN_MESSAGE);
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
    await page.locator(AUTH_SELECTORS.SIGN_IN_EMAIL).fill('wrong@example.com');
    await page.locator(AUTH_SELECTORS.SIGN_IN_PASSWORD).fill('wrongpass');
    await page
      .locator(AUTH_SELECTORS.SIGN_IN_FORM)
      .locator(AUTH_SELECTORS.SUBMIT_BTN)
      .click();
    const msg = page.locator(AUTH_SELECTORS.SIGN_IN_MESSAGE);
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText('Invalid credentials');
    await expect(msg).toHaveClass(/message-error/);
  });
});
