import { test, expect } from '@playwright/test';
import {
  ROUTES,
  TEST_SELECTORS as SELECTORS,
  TEST_ATTRIBUTES as ATTRIBUTES,
  TEST_STRINGS as STRINGS,
  TEST_FILTERS as FILTERS,
} from '../src/js/constants.js';

const createHelpers = (page) => {
  const locate = (selector) => page.locator(selector);

  const verifyClass = async (selector, className, hasClass = true) => {
    const assertion = expect(locate(selector));
    await (hasClass ? assertion : assertion.not).toHaveClass(className);
  };

  const applyFilter = async (type, value) => {
    const selector =
      type === 'cuisine'
        ? SELECTORS.CUISINE_OPTION(value)
        : SELECTORS.MEAL_OPTION(value);
    await locate(selector).click();
  };

  const submitFilters = async () => {
    await locate(SELECTORS.APPLY_FILTERS).click();
  };

  const verifyElementCount = async (selector, count) => {
    await expect(locate(selector)).toHaveCount(count);
  };

  const verifyText = async (selector, text) => {
    await expect(locate(selector)).toHaveText(text);
  };

  const search = async (term) => {
    await locate(SELECTORS.SEARCH).fill(term);
  };

  return {
    navigate: async () => {
      await page.goto(ROUTES.EXPLORE);
      await page.waitForLoadState('networkidle');
    },

    verifyCardCount: (count) => verifyElementCount(SELECTORS.CARD, count),

    verifyPageTitle: () => verifyText(SELECTORS.PAGE_TITLE, STRINGS.PAGE_TITLE),

    verifyContainText: async (selector, text) => {
      await expect(locate(selector)).toContainText(text);
    },

    verifyVisibility: async (selector, isVisible = true) => {
      const assertion = expect(locate(selector));
      await (isVisible ? assertion : assertion.not).toBeVisible();
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

    searchForName: () => search(STRINGS.SEARCH_TERM_NAME),
    searchForCuisine: () => search(STRINGS.SEARCH_TERM_CUISINE),
    searchForInvalid: () => search(STRINGS.SEARCH_TERM_INVALID),
    searchForCase: () => search(STRINGS.SEARCH_TERM_CASE),
    searchForRooms: () => search(STRINGS.SEARCH_ROOMS),

    openFilterModal: async () => {
      await locate(SELECTORS.FILTER_BTN).click();
    },

    closeFilterModalViaButton: async () => {
      await locate(SELECTORS.FILTER_CLOSE).click();
    },

    closeFilterModalViaEsc: async () => {
      await page.keyboard.press('Escape');
    },

    applySouthIndianFilter: () => applyFilter('cuisine', FILTERS.CUISINE_SOUTH),
    applyBreakfastFilter: () => applyFilter('meal', FILTERS.MEAL_BREAKFAST),

    submitFilters,

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

    checkActiveSouthIndianFilter: async () => {
      const selector = SELECTORS.CUISINE_OPTION(FILTERS.CUISINE_SOUTH);
      await expect(locate(selector)).toHaveClass(STRINGS.CLASS_ACTIVE);
    },

    verifyMatchedName: () =>
      verifyText(
        `${SELECTORS.CARD} ${SELECTORS.CARD_TITLE}`,
        STRINGS.MATCHED_NAME
      ),
    verifyMatchedCuisine: () =>
      verifyText(
        `${SELECTORS.CARD} ${SELECTORS.CARD_CUISINE}`,
        STRINGS.MATCHED_CUISINE
      ),
    verifyNoResultsMsg: () =>
      verifyText(SELECTORS.NO_RESULTS, STRINGS.NO_RESULTS_MSG),
    verifyCombinedResult: () =>
      expect(locate(`${SELECTORS.CARD} ${SELECTORS.CARD_TITLE}`)).toContainText(
        STRINGS.COMBINED_RESULT
      ),
    verifyFilterModalOpen: () =>
      verifyClass(SELECTORS.FILTER_MODAL, STRINGS.CLASS_ACTIVE, true),
    verifyFilterModalClosed: () =>
      verifyClass(SELECTORS.FILTER_MODAL, STRINGS.CLASS_ACTIVE, false),
    verifyDetailModalOpen: () =>
      verifyClass(SELECTORS.DETAIL_MODAL, STRINGS.CLASS_ACTIVE, true),
    verifyDetailModalClosed: () =>
      verifyClass(SELECTORS.DETAIL_MODAL, STRINGS.CLASS_ACTIVE, false),
    verifyModalBodyTitle: (title) =>
      verifyText(SELECTORS.MODAL_BODY_TITLE, title),
    verifyModalPriceCurrency: () =>
      expect(locate(SELECTORS.MODAL_PRICE)).toContainText(STRINGS.CURRENCY),
    verifyCloseButtonLabel: () =>
      expect(locate(SELECTORS.FILTER_CLOSE)).toHaveAttribute(
        ATTRIBUTES.ARIA_LABEL,
        STRINGS.CLOSE_MODAL_LABEL
      ),
    verifySearchPlaceholder: () =>
      expect(locate(SELECTORS.SEARCH)).toHaveAttribute(
        ATTRIBUTES.PLACEHOLDER,
        STRINGS.SEARCH_PLACEHOLDER
      ),
    verifyContainerVisible: () =>
      expect(locate(SELECTORS.CONTAINER_WIDE)).toBeVisible(),
    verifyGridVisible: () => expect(locate(SELECTORS.GRID)).toBeVisible(),
    verifyNoResultsVisible: () =>
      expect(locate(SELECTORS.NO_RESULTS)).toBeVisible(),
    verifyFilterModalVisible: () =>
      expect(locate(SELECTORS.FILTER_MODAL)).toBeVisible(),
    verifyDetailModalVisible: () =>
      expect(locate(SELECTORS.DETAIL_MODAL)).toBeVisible(),
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
      await actions.verifyCardCount(6);
    });

    test('should display page title correctly', async () => {
      await actions.verifyPageTitle();
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
      await actions.searchForName();
      await actions.verifyCardCount(1);
      await actions.verifyMatchedName();
    });

    test('should filter restaurants by cuisine', async () => {
      await actions.searchForCuisine();
      await actions.verifyCardCount(1);
      await actions.verifyMatchedCuisine();
    });

    test('should show no results message for invalid search', async () => {
      await actions.searchForInvalid();
      await actions.verifyNoResultsVisible();
      await actions.verifyNoResultsMsg();
    });

    test('should be case-insensitive', async () => {
      await actions.searchForCase();
      await actions.verifyCardCount(1);
    });
  });

  test.describe('Filter Modal', () => {
    test('should open filter modal when Filter button is clicked', async () => {
      await actions.openFilterModal();
      await actions.verifyFilterModalOpen();
      await actions.verifyFilterModalVisible();
    });

    test.describe('When Filter Modal is Open', () => {
      test.beforeEach(async () => {
        await actions.openFilterModal();
      });

      test('should close filter modal when close button is clicked', async () => {
        await actions.closeFilterModalViaButton();
        await actions.verifyFilterModalClosed();
      });

      test('should close filter modal when ESC key is pressed', async () => {
        await actions.closeFilterModalViaEsc();
        await actions.verifyFilterModalClosed();
      });

      test('should filter by cuisine (South Indian)', async () => {
        await actions.applySouthIndianFilter();
        await actions.submitFilters();
        await actions.verifyCardCount(2);
      });

      test('should filter by meal type (breakfast)', async () => {
        await actions.applyBreakfastFilter();
        await actions.submitFilters();
        await actions.verifyCardCount(4);
      });

      test('should apply combined filters (cuisine + meal type)', async () => {
        await actions.applySouthIndianFilter();
        await actions.applyBreakfastFilter();
        await actions.submitFilters();
        await actions.verifyCardCount(2);
      });

      test('should highlight active filter chips', async () => {
        await actions.applySouthIndianFilter();
        await actions.checkActiveSouthIndianFilter();
      });

      test('should have proper ARIA labels on modal close buttons', async () => {
        await actions.verifyCloseButtonLabel();
      });
    });
  });

  test.describe('Combined Search and Filters', () => {
    test('should work with search + cuisine filter', async () => {
      await actions.searchForRooms();
      await actions.openFilterModal();
      await actions.applySouthIndianFilter();
      await actions.submitFilters();
      await actions.verifyCardCount(1);
      await actions.verifyCombinedResult();
    });
  });

  test.describe('Detail Modal', () => {
    let cardTitle;

    test('should open detail modal when restaurant card is clicked', async () => {
      await actions.clickCard();
      await actions.verifyDetailModalOpen();
      await actions.verifyDetailModalVisible();
    });

    test.describe('When Detail Modal is Open', () => {
      test.beforeEach(async () => {
        cardTitle = await actions.getCardTitle();
        await actions.clickCard();
      });

      test('should display correct restaurant details in modal', async () => {
        await actions.verifyModalBodyTitle(cardTitle);
      });

      test('should close detail modal via ESC key', async () => {
        await actions.closeDetailModal();
        await actions.verifyDetailModalClosed();
      });

      test('should display modal centered on screen', async () => {
        await actions.verifyModalCentering();
      });

      test('should show Indian Rupee symbol in modal', async () => {
        await actions.verifyModalPriceCurrency();
      });
    });
  });

  test.describe('Layout and Responsiveness', () => {
    test('should use container-wide class for wider layout', async () => {
      await actions.verifyContainerVisible();
    });

    test('should have reduced side spacing', async () => {
      await actions.verifyContainerResponsive();
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await actions.verifyCardCount(6);
      await actions.verifyGridVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper input placeholder', async () => {
      await actions.verifySearchPlaceholder();
    });
  });
});
