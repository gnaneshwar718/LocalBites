import { test, expect } from '@playwright/test';

test.describe('HomePage UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/LocalBites/);
  });

  test('should toggle hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });

    const hamburger = page.locator('.hamburger');
    const navLinks = page.locator('.nav-links');

    await expect(hamburger).toBeVisible();

    await expect(navLinks).not.toHaveClass(/active/);

    await hamburger.click();
    await expect(navLinks).toHaveClass(/active/);

    await hamburger.click();
    await expect(navLinks).not.toHaveClass(/active/);
  });

  test('should have an active carousel slide', async ({ page }) => {
    const activeSlide = page.locator('.carousel-item.active');
    await expect(activeSlide).toBeVisible();
  });

  test('should display hero section with correct text', async ({ page }) => {
    const title = page.locator('.hero-text h1');
    const description = page.locator('.hero-text p');
    await expect(title).toContainText('Discover Authentic Local Food');
    await expect(description).toContainText(
      'Experience a city through its food'
    );
  });

  test('should navigate to auth page when clicking profile link', async ({
    page,
  }) => {
    await page.click('text=Profile');
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should have exactly 3 feature cards', async ({ page }) => {
    const cards = page.locator('.feature-card');
    await expect(cards).toHaveCount(3);
  });

  test('should show FAQ items', async ({ page }) => {
    const faqItems = page.locator('.faq-item');
    await expect(faqItems).toHaveCount(4);
    await expect(faqItems.first()).toBeVisible();
  });

  test('footer FAQ link should navigate to faq section', async ({ page }) => {
    const faqLink = page.locator('footer a:text("FAQ")');
    await faqLink.click();
    await expect(page).toHaveURL(/#faq/);
    const faqSection = page.locator('#faq');
    await expect(faqSection).toBeInViewport();
  });

  test('header elements should be on the same line on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 600 });

    const logo = page.locator('.logo');
    const profile = page.locator('.profile-link');
    const hamburger = page.locator('.hamburger');

    const logoBox = await logo.boundingBox();
    const profileBox = await profile.boundingBox();
    const hamburgerBox = await hamburger.boundingBox();

    // Check if all are on roughly the same Y coordinate (within 10px tolerance)
    const minY = Math.min(logoBox.y, profileBox.y, hamburgerBox.y);
    const maxY = Math.max(
      logoBox.y + logoBox.height,
      profileBox.y + profileBox.height,
      hamburgerBox.y + hamburgerBox.height
    );

    // Difference between bottom-most and top-most point should be reasonable for a single line
    // Considering potential variations in item height
    expect(maxY - minY).toBeLessThan(60);
  });
});
