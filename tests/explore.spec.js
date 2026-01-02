import { test, expect } from '@playwright/test';

test.describe('Explore Page - UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Initial State', () => {
    test('should render all 6 restaurants on page load', async ({ page }) => {
      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(6);
    });

    test('should display page title correctly', async ({ page }) => {
      const title = page.locator('h1');
      await expect(title).toHaveText('Popular Local Discoveries');
    });

    test('should use Indian Rupee symbol for all prices', async ({ page }) => {
      const prices = page.locator('.card-price');
      const count = await prices.count();

      for (let i = 0; i < count; i++) {
        const priceText = await prices.nth(i).textContent();
        expect(priceText).toContain('₹');
      }
    });

    test('should have proper grid layout with multiple items per row', async ({
      page,
    }) => {
      const grid = page.locator('#restaurantGrid');
      const gridStyles = await grid.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
        };
      });

      expect(gridStyles.display).toBe('grid');
      expect(gridStyles.gridTemplateColumns.split(' ').length).toBeGreaterThan(
        1
      );
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter restaurants by name', async ({ page }) => {
      const searchInput = page.locator('#restaurantSearch');
      await searchInput.fill('Vidyarthi');

      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(1);

      const cardTitle = cards.locator('h3');
      await expect(cardTitle).toHaveText('Vidyarthi Bhavan');
    });

    test('should filter restaurants by cuisine', async ({ page }) => {
      const searchInput = page.locator('#restaurantSearch');
      await searchInput.fill('Andhra');

      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(1);

      const cuisine = cards.locator('.card-cuisine');
      await expect(cuisine).toHaveText('Andhra');
    });

    test('should show no results message for invalid search', async ({
      page,
    }) => {
      const searchInput = page.locator('#restaurantSearch');
      await searchInput.fill('NonExistentRestaurant');

      const noResults = page.locator('.no-results');
      await expect(noResults).toBeVisible();
      await expect(noResults).toHaveText(
        'No restaurants found matching your criteria.'
      );
    });

    test('should be case-insensitive', async ({ page }) => {
      const searchInput = page.locator('#restaurantSearch');
      await searchInput.fill('mtr');

      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(1);
    });
  });

  test.describe('Filter Modal', () => {
    test('should open filter modal when Filter button is clicked', async ({
      page,
    }) => {
      const filterBtn = page.locator('#filterBtn');
      await filterBtn.click();

      const filterModal = page.locator('#filterModal');
      await expect(filterModal).toHaveClass(/active/);
      await expect(filterModal).toBeVisible();
    });

    test('should close filter modal when close button is clicked', async ({
      page,
    }) => {
      await page.locator('#filterBtn').click();
      await page.locator('#filterModal .modal-close').click();

      const filterModal = page.locator('#filterModal');
      await expect(filterModal).not.toHaveClass(/active/);
    });

    test('should close filter modal when ESC key is pressed', async ({
      page,
    }) => {
      await page.locator('#filterBtn').click();
      await page.keyboard.press('Escape');

      const filterModal = page.locator('#filterModal');
      await expect(filterModal).not.toHaveClass(/active/);
    });

    test('should filter by cuisine (South Indian)', async ({ page }) => {
      await page.locator('#filterBtn').click();
      await page.locator('[data-cuisine="South Indian"]').click();
      await page.locator('#applyFiltersBtn').click();

      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(2);
    });

    test('should filter by meal type (breakfast)', async ({ page }) => {
      await page.locator('#filterBtn').click();
      await page.locator('[data-mealtype="breakfast"]').click();
      await page.locator('#applyFiltersBtn').click();

      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(4);
    });

    test('should apply combined filters (cuisine + meal type)', async ({
      page,
    }) => {
      await page.locator('#filterBtn').click();
      await page.locator('[data-cuisine="South Indian"]').click();
      await page.locator('[data-mealtype="breakfast"]').click();
      await page.locator('#applyFiltersBtn').click();

      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(2);
    });

    test('should highlight active filter chips', async ({ page }) => {
      await page.locator('#filterBtn').click();
      const southIndianChip = page.locator('[data-cuisine="South Indian"]');
      await southIndianChip.click();

      await expect(southIndianChip).toHaveClass(/active/);
    });
  });

  test.describe('Combined Search and Filters', () => {
    test('should work with search + cuisine filter', async ({ page }) => {
      await page.locator('#restaurantSearch').fill('Rooms');

      await page.locator('#filterBtn').click();
      await page.locator('[data-cuisine="South Indian"]').click();
      await page.locator('#applyFiltersBtn').click();

      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(1);

      const cardTitle = cards.locator('h3');
      await expect(cardTitle).toContainText('MTR');
    });
  });

  test.describe('Detail Modal', () => {
    test('should open detail modal when restaurant card is clicked', async ({
      page,
    }) => {
      const firstCard = page.locator('.restaurant-card').first();
      await firstCard.click();

      const detailModal = page.locator('#detailModal');
      await expect(detailModal).toHaveClass(/active/);
      await expect(detailModal).toBeVisible();
    });

    test('should display correct restaurant details in modal', async ({
      page,
    }) => {
      const firstCard = page.locator('.restaurant-card').first();
      const cardTitle = await firstCard.locator('h3').textContent();

      await firstCard.click();

      const modalTitle = page.locator('#modalBody h2');
      await expect(modalTitle).toHaveText(cardTitle);
    });

    test('should close detail modal via close button', async ({ page }) => {
      await page.locator('.restaurant-card').first().click();
      await page.locator('#detailModal .modal-close').click();

      const detailModal = page.locator('#detailModal');
      await expect(detailModal).not.toHaveClass(/active/);
    });

    test('should close detail modal via ESC key', async ({ page }) => {
      await page.locator('.restaurant-card').first().click();
      await page.keyboard.press('Escape');

      const detailModal = page.locator('#detailModal');
      await expect(detailModal).not.toHaveClass(/active/);
    });

    test('should display modal centered on screen', async ({ page }) => {
      await page.locator('.restaurant-card').first().click();

      const modal = page.locator('#detailModal');
      const modalStyles = await modal.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          alignItems: styles.alignItems,
          justifyContent: styles.justifyContent,
        };
      });

      expect(modalStyles.display).toBe('flex');
      expect(modalStyles.alignItems).toBe('center');
      expect(modalStyles.justifyContent).toBe('center');
    });

    test('should show Indian Rupee symbol in modal', async ({ page }) => {
      await page.locator('.restaurant-card').first().click();

      const modalPrice = page.locator('#modalBody .card-price');
      const priceText = await modalPrice.textContent();
      expect(priceText).toContain('₹');
    });
  });

  test.describe('Layout and Responsiveness', () => {
    test('should use container-wide class for wider layout', async ({
      page,
    }) => {
      const container = page.locator('.container-wide');
      await expect(container).toBeVisible();
    });

    test('should have reduced side spacing', async ({ page }) => {
      const container = page.locator('.container-wide');
      const geometry = await container.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          viewportWidth: window.innerWidth,
        };
      });

      expect(geometry.width / geometry.viewportWidth).toBeGreaterThan(0.9);
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const cards = page.locator('.restaurant-card');
      await expect(cards).toHaveCount(6);

      const grid = page.locator('#restaurantGrid');
      await expect(grid).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels on modal close buttons', async ({
      page,
    }) => {
      await page.locator('#filterBtn').click();
      const closeBtn = page.locator('#filterModal .modal-close');
      await expect(closeBtn).toHaveAttribute('aria-label', 'Close modal');
    });

    test('should have proper input placeholder', async ({ page }) => {
      const searchInput = page.locator('#restaurantSearch');
      await expect(searchInput).toHaveAttribute(
        'placeholder',
        'Search by name or cuisine...'
      );
    });
  });
});
