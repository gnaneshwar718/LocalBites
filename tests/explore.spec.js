import { test, expect } from '@playwright/test';

const ROUTES = {
  EXPLORE: '/explore',
};

const SELECTORS = {
  CARD: '.restaurant-card',
  CARD_TITLE: 'h3',
  CARD_PRICE: '.card-price',
  CARD_CUISINE: '.card-cuisine',
  GRID: '#restaurantGrid',
  PAGE_TITLE: 'h1',
  SEARCH: '#restaurantSearch',
  NO_RESULTS: '.no-results',
  FILTER_BTN: '#filterBtn',
  FILTER_MODAL: '#filterModal',
  FILTER_CLOSE: '#filterModal .modal-close',
  APPLY_FILTERS: '#applyFiltersBtn',
  DETAIL_MODAL: '#detailModal',
  MODAL_BODY_TITLE: '#modalBody h2',
  MODAL_PRICE: '#modalBody .card-price',
  CONTAINER_WIDE: '.container-wide',
  CUISINE_OPTION: (cuisine) => `[data-cuisine="${cuisine}"]`,
  MEAL_OPTION: (type) => `[data-mealtype="${type}"]`,
};

const ATTRIBUTES = {
  ARIA_LABEL: 'aria-label',
  PLACEHOLDER: 'placeholder',
};

const STRINGS = {
  PAGE_TITLE: 'Popular Local Discoveries',
  CURRENCY: '₹',
  GRID_DISPLAY: 'grid',
  SEARCH_TERM_NAME: 'Vidyarthi',
  SEARCH_TERM_CUISINE: 'Andhra',
  SEARCH_TERM_INVALID: 'NonExistentRestaurant',
  SEARCH_TERM_CASE: 'mtr',
  MATCHED_NAME: 'Vidyarthi Bhavan',
  MATCHED_CUISINE: 'Andhra',
  NO_RESULTS_MSG: 'No restaurants found matching your criteria.',
  SOUTH_INDIAN: 'South Indian',
  BREAKFAST: 'breakfast',
  COMBINED_RESULT: 'MTR',
  SEARCH_ROOMS: 'Rooms',
  CLOSE_MODAL_LABEL: 'Close modal',
  SEARCH_PLACEHOLDER: 'Search by name or cuisine...',
  CLASS_ACTIVE: /active/,
  FLEX: 'flex',
  CENTER: 'center',
};

const FILTERS = {
  CUISINE_SOUTH: 'South Indian',
  MEAL_BREAKFAST: 'breakfast',
};

const createHelpers = (page) => {
  const locate = (selector) => page.locator(selector);

  return {
    navigate: async () => {
      await page.goto(ROUTES.EXPLORE);
      await page.waitForLoadState('networkidle');
    },

    verifyElementCount: async (selector, count) => {
      await expect(locate(selector)).toHaveCount(count);
    },

    verifyText: async (selector, text) => {
      await expect(locate(selector)).toHaveText(text);
    },

    verifyContainText: async (selector, text) => {
      await expect(locate(selector)).toContainText(text);
    },

    verifyVisibility: async (selector, isVisible = true) => {
      const assertion = expect(locate(selector));
      await (isVisible ? assertion : assertion.not).toBeVisible();
    },

    verifyClass: async (selector, className, hasClass = true) => {
      const assertion = expect(locate(selector));
      await (hasClass ? assertion : assertion.not).toHaveClass(className);
    },

    verifyAttribute: async (selector, attr, value) => {
      await expect(locate(selector)).toHaveAttribute(attr, value);
    },

    verifyGridStyles: async () => {
      const grid = locate(SELECTORS.GRID);
      const styles = await grid.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          display: s.display,
          columns: s.gridTemplateColumns,
        };
      });
      expect(styles.display).toBe(STRINGS.GRID_DISPLAY);
      expect(styles.columns.split(' ').length).toBeGreaterThan(1);
    },

    verifyPricesContainSymbol: async () => {
      const prices = locate(SELECTORS.CARD_PRICE);
      const count = await prices.count();
      for (let i = 0; i < count; i++) {
        expect(await prices.nth(i).textContent()).toContain(STRINGS.CURRENCY);
      }
    },

    search: async (term) => {
      await locate(SELECTORS.SEARCH).fill(term);
    },

    openFilterModal: async () => {
      await locate(SELECTORS.FILTER_BTN).click();
    },

    closeFilterModal: async (viaButton = true) => {
      if (viaButton) {
        await locate(SELECTORS.FILTER_CLOSE).click();
      } else {
        await page.keyboard.press('Escape');
      }
    },

    applyFilter: async (type, value) => {
      const selector =
        type === 'cuisine'
          ? SELECTORS.CUISINE_OPTION(value)
          : SELECTORS.MEAL_OPTION(value);
      await locate(selector).click();
    },

    submitFilters: async () => {
      await locate(SELECTORS.APPLY_FILTERS).click();
    },

    clickCard: async (index = 0) => {
      await locate(SELECTORS.CARD).nth(index).click();
    },

    closeDetailModal: async () => {
      await page.keyboard.press('Escape');
    },

    getCardTitle: async (index = 0) => {
      return await locate(SELECTORS.CARD)
        .nth(index)
        .locator(SELECTORS.CARD_TITLE)
        .textContent();
    },

    verifyModalCentering: async () => {
      const modal = locate(SELECTORS.DETAIL_MODAL);
      const styles = await modal.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          display: s.display,
          align: s.alignItems,
          justify: s.justifyContent,
        };
      });
      expect(styles.display).toBe(STRINGS.FLEX);
      expect(styles.align).toBe(STRINGS.CENTER);
      expect(styles.justify).toBe(STRINGS.CENTER);
    },

    verifyContainerResponsive: async () => {
      const container = locate(SELECTORS.CONTAINER_WIDE);
      const geometry = await container.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return { width: rect.width, viewport: window.innerWidth };
      });
      expect(geometry.width / geometry.viewport).toBeGreaterThan(0.9);
    },

    checkActiveFilter: async (type, value) => {
      const selector =
        type === 'cuisine'
          ? SELECTORS.CUISINE_OPTION(value)
          : SELECTORS.MEAL_OPTION(value);
      await expect(locate(selector)).toHaveClass(STRINGS.CLASS_ACTIVE);
    },
  };
};

test.describe('Explore Page - UI Tests', () => {
  let actions;

  test.beforeEach(async ({ page }) => {
    actions = createHelpers(page);
    await actions.navigate();
  });

  test.describe('Initial State', () => {
    test('should render all 6 restaurants on page load', async () => {
      await actions.verifyElementCount(SELECTORS.CARD, 6);
    });

    test('should display page title correctly', async () => {
      await actions.verifyText(SELECTORS.PAGE_TITLE, STRINGS.PAGE_TITLE);
    });

    test('should use Indian Rupee symbol for all prices', async () => {
      await actions.verifyPricesContainSymbol();
    });

    test('should have proper grid layout with multiple items per row', async () => {
      await actions.verifyGridStyles();
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter restaurants by name', async () => {
      await actions.search(STRINGS.SEARCH_TERM_NAME);
      await actions.verifyElementCount(SELECTORS.CARD, 1);
      await actions.verifyText(
        `${SELECTORS.CARD} ${SELECTORS.CARD_TITLE}`,
        STRINGS.MATCHED_NAME
      );
    });

    test('should filter restaurants by cuisine', async () => {
      await actions.search(STRINGS.SEARCH_TERM_CUISINE);
      await actions.verifyElementCount(SELECTORS.CARD, 1);
      await actions.verifyText(
        `${SELECTORS.CARD} ${SELECTORS.CARD_CUISINE}`,
        STRINGS.MATCHED_CUISINE
      );
    });

    test('should show no results message for invalid search', async () => {
      await actions.search(STRINGS.SEARCH_TERM_INVALID);
      await actions.verifyVisibility(SELECTORS.NO_RESULTS);
      await actions.verifyText(SELECTORS.NO_RESULTS, STRINGS.NO_RESULTS_MSG);
    });

    test('should be case-insensitive', async () => {
      await actions.search(STRINGS.SEARCH_TERM_CASE);
      await actions.verifyElementCount(SELECTORS.CARD, 1);
    });
  });

  test.describe('Filter Modal', () => {
    test('should open filter modal when Filter button is clicked', async () => {
      await actions.openFilterModal();
      await actions.verifyClass(SELECTORS.FILTER_MODAL, STRINGS.CLASS_ACTIVE);
      await actions.verifyVisibility(SELECTORS.FILTER_MODAL);
    });

    test.describe('When Filter Modal is Open', () => {
      test.beforeEach(async () => {
        await actions.openFilterModal();
      });

      test('should close filter modal when close button is clicked', async () => {
        await actions.closeFilterModal(true);
        await actions.verifyClass(
          SELECTORS.FILTER_MODAL,
          STRINGS.CLASS_ACTIVE,
          false
        );
      });

      test('should close filter modal when ESC key is pressed', async () => {
        await actions.closeFilterModal(false);
        await actions.verifyClass(
          SELECTORS.FILTER_MODAL,
          STRINGS.CLASS_ACTIVE,
          false
        );
      });

      test('should filter by cuisine (South Indian)', async () => {
        await actions.applyFilter('cuisine', FILTERS.CUISINE_SOUTH);
        await actions.submitFilters();
        await actions.verifyElementCount(SELECTORS.CARD, 2);
      });

      test('should filter by meal type (breakfast)', async () => {
        await actions.applyFilter('meal', FILTERS.MEAL_BREAKFAST);
        await actions.submitFilters();
        await actions.verifyElementCount(SELECTORS.CARD, 4);
      });

      test('should apply combined filters (cuisine + meal type)', async () => {
        await actions.applyFilter('cuisine', FILTERS.CUISINE_SOUTH);
        await actions.applyFilter('meal', FILTERS.MEAL_BREAKFAST);
        await actions.submitFilters();
        await actions.verifyElementCount(SELECTORS.CARD, 2);
      });

      test('should highlight active filter chips', async () => {
        await actions.applyFilter('cuisine', FILTERS.CUISINE_SOUTH);
        await actions.checkActiveFilter('cuisine', FILTERS.CUISINE_SOUTH);
      });

      test('should have proper ARIA labels on modal close buttons', async () => {
        await actions.verifyAttribute(
          SELECTORS.FILTER_CLOSE,
          ATTRIBUTES.ARIA_LABEL,
          STRINGS.CLOSE_MODAL_LABEL
        );
      });
    });
  });

  test.describe('Combined Search and Filters', () => {
    test('should work with search + cuisine filter', async () => {
      await actions.search(STRINGS.SEARCH_ROOMS);
      await actions.openFilterModal();
      await actions.applyFilter('cuisine', FILTERS.CUISINE_SOUTH);
      await actions.submitFilters();
      await actions.verifyElementCount(SELECTORS.CARD, 1);
      await actions.verifyContainText(
        `${SELECTORS.CARD} ${SELECTORS.CARD_TITLE}`,
        STRINGS.COMBINED_RESULT
      );
    });
  });

  test.describe('Detail Modal', () => {
    let cardTitle;

    test('should open detail modal when restaurant card is clicked', async () => {
      await actions.clickCard();
      await actions.verifyClass(SELECTORS.DETAIL_MODAL, STRINGS.CLASS_ACTIVE);
      await actions.verifyVisibility(SELECTORS.DETAIL_MODAL);
    });

    test.describe('When Detail Modal is Open', () => {
      test.beforeEach(async () => {
        // Store info for verification before clicking
        cardTitle = await actions.getCardTitle();
        await actions.clickCard();
      });

      test('should display correct restaurant details in modal', async () => {
        await actions.verifyText(SELECTORS.MODAL_BODY_TITLE, cardTitle);
      });

      test('should close detail modal via ESC key', async () => {
        await actions.closeDetailModal();
        await actions.verifyClass(
          SELECTORS.DETAIL_MODAL,
          STRINGS.CLASS_ACTIVE,
          false
        );
      });

      test('should display modal centered on screen', async () => {
        await actions.verifyModalCentering();
      });

      test('should show Indian Rupee symbol in modal', async () => {
        await actions.verifyContainText(
          SELECTORS.MODAL_PRICE,
          STRINGS.CURRENCY
        );
      });
    });
  });

  test.describe('Layout and Responsiveness', () => {
    test('should use container-wide class for wider layout', async () => {
      await actions.verifyVisibility(SELECTORS.CONTAINER_WIDE);
    });

    test('should have reduced side spacing', async () => {
      await actions.verifyContainerResponsive();
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await actions.verifyElementCount(SELECTORS.CARD, 6);
      await actions.verifyVisibility(SELECTORS.GRID);
    });
  });

  test.describe('Accessibility', () => {
    // Note: The modal close button test was moved into 'When Filter Modal is Open'

    test('should have proper input placeholder', async () => {
      await actions.verifyAttribute(
        SELECTORS.SEARCH,
        ATTRIBUTES.PLACEHOLDER,
        STRINGS.SEARCH_PLACEHOLDER
      );
    });
  });
});
