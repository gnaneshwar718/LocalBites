import { test, expect } from '@playwright/test';

test.describe('HomePage UI - LocalBites', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Initial State', () => {
    test('should have the correct title', async ({ page }) => {
      await expect(page).toHaveTitle(/LocalBites/);
    });

    test('should display hero section with correct text', async ({ page }) => {
      const title = page.locator('.hero-text h1');
      const description = page.locator('.hero-text p');

      await expect(title).toContainText('Discover Authentic Local Food');
      await expect(description).toContainText(
        'Experience a city through its food'
      );
    });

    test('should have an active hero carousel', async ({ page }) => {
      const activeSlide = page.locator('.carousel-item.active');
      await expect(activeSlide).toBeVisible();

      const carouselImages = page.locator('.carousel-item img');
      await expect(carouselImages.first()).toBeVisible();
    });
  });

  test.describe('Navigation & Interactions', () => {
    test('should display Explore Local Food button', async ({ page }) => {
      const exploreBtn = page.locator('button.btn-primary', {
        hasText: 'Explore Local Food',
      });
      await expect(exploreBtn).toBeVisible();
    });

    test('should navigate to culture page when Stories Behind Food is clicked', async ({
      page,
    }) => {
      const planBtn = page.locator('a.btn-primary', {
        hasText: 'Stories Behind Food',
      });
      await expect(planBtn).toBeVisible();

      await planBtn.click();
      await expect(page).toHaveURL(/\/culture/);
    });

    test('should toggle hamburger menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const hamburger = page.locator('.hamburger');
      const navLinks = page.locator('.nav-links');

      await expect(hamburger).toBeVisible();
      await expect(navLinks).not.toHaveClass(/active/);

      await hamburger.click();
      await expect(navLinks).toHaveClass(/active/);

      await hamburger.click();
      await expect(navLinks).not.toHaveClass(/active/);
    });

    test('should navigate to auth page when clicking profile link', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      const profileLink = page.locator('text=Profile');
      await expect(profileLink).toBeVisible();
      await profileLink.click();
      await expect(page).toHaveURL(/\/auth/);
    });
  });

  test.describe('Features Section', () => {
    test('should have exactly 3 feature cards', async ({ page }) => {
      const cards = page.locator('.feature-card');
      await expect(cards).toHaveCount(3);
    });

    test('should display Search, Plan, and Learn features', async ({
      page,
    }) => {
      const cards = page.locator('.feature-card');

      await expect(cards.nth(0).locator('h3')).toHaveText('Search');
      await expect(cards.nth(0).locator('.subtitle')).toHaveText(
        'Discover Local Food Spots'
      );

      await expect(cards.nth(1).locator('h3')).toHaveText('Plan');
      await expect(cards.nth(1).locator('.subtitle')).toHaveText(
        'Plan Meals by Budget'
      );

      await expect(cards.nth(2).locator('h3')).toHaveText('Learn');
      await expect(cards.nth(2).locator('.subtitle')).toHaveText(
        'History behind each dish'
      );
    });
  });

  test.describe('FAQ Section', () => {
    test('should show 4 FAQ items', async ({ page }) => {
      const faqItems = page.locator('.faq-item');
      await expect(faqItems).toHaveCount(4);
    });

    test('should display specific FAQ questions', async ({ page }) => {
      const faqList = page.locator('.faq-list');
      await expect(faqList).toContainText('How accurate are the prices?');
      await expect(faqList).toContainText('Can I trust these recommendations?');
      await expect(faqList).toContainText('Is the app available everywhere?');
      await expect(faqList).toContainText('How do I plan my budget?');
    });

    test('footer FAQ link should navigate to faq section', async ({ page }) => {
      const faqLink = page.locator('footer a', { hasText: 'FAQ' });
      await faqLink.click();
      await expect(page).toHaveURL(/#faq/);
      const faqSection = page.locator('#faq');
      await expect(faqSection).toBeInViewport();
    });
  });

  test.describe('Layout and Responsiveness', () => {
    test('should use container class for layout', async ({ page }) => {
      const container = page.locator('.hero.container');
      await expect(container).toBeVisible();
    });

    test('header elements should be aligned on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 600 });

      const logo = page.locator('.logo');
      const profile = page.locator('.profile-link');
      const hamburger = page.locator('.hamburger');

      await expect(logo).toBeVisible();
      await expect(hamburger).toBeVisible();

      const logoBox = await logo.boundingBox();
      const profileBox = await profile.boundingBox();
      const hamburgerBox = await hamburger.boundingBox();

      if (logoBox && profileBox && hamburgerBox) {
        const minY = Math.min(logoBox.y, profileBox.y, hamburgerBox.y);
        const maxY = Math.max(
          logoBox.y + logoBox.height,
          profileBox.y + profileBox.height,
          hamburgerBox.y + hamburgerBox.height
        );

        expect(maxY - minY).toBeLessThan(80);
      }
    });
  });
});
