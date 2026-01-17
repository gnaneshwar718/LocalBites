import { test, expect } from '@playwright/test';
import { ROUTES } from '../../../route.js';
import {
  TEST_SELECTORS as SELECTORS,
  TEST_ATTRIBUTES as ATTRIBUTES,
  TEST_STRINGS as STRINGS,
  TEST_FILTERS as FILTERS,
  TEST_TIMEOUTS as TIMEOUTS,
  TEST_DIMENSIONS as DIMENSIONS,
  TEST_DEFAULTS as DEFAULTS,
} from '../constants/test-constants.js';

const createHelpers = (page) => {
  const locate = (selector) => page.locator(selector);
  const verifyCount = async (min = DEFAULTS.MIN_COUNT) =>
    expect(await locate(SELECTORS.CARD).count()).toBeGreaterThanOrEqual(min);

  const verifyVisible = async (selector) =>
    expect(locate(selector)).toBeVisible();

  const verifyText = async (selector, text) =>
    expect(locate(selector)).toContainText(text);

  const verifyClass = async (selector, cls, has = true) => {
    const assertion = expect(locate(selector));
    await (has ? assertion : assertion.not).toHaveClass(cls);
  };

  const genericSearch = async (term) => {
    await locate(SELECTORS.SEARCH).fill(term);
    await page.waitForTimeout(TIMEOUTS.SEARCH_DELAY);
  };

  const genericFilter = async (type, val) => {
    const sel =
      type === 'cuisine'
        ? SELECTORS.CUISINE_OPTION(val)
        : SELECTORS.MEAL_OPTION(val);
    await locate(sel).click();
  };

  const getCompStyle = async (selector) => {
    return await locate(selector).evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        columns: s.gridTemplateColumns,
      };
    });
  };

  return {
    navigate: async () => {
      await page.goto(ROUTES.EXPLORE);
      await page
        .locator(SELECTORS.CARD)
        .first()
        .waitFor({ timeout: TIMEOUTS.NAVIGATION });
    },
    performSearch: async (term) => genericSearch(term),
    toggleFilterModal: async (open = true, verify = false) => {
      if (open) await locate(SELECTORS.FILTER_BTN).click();
      else await locate(SELECTORS.FILTER_CLOSE).evaluate((el) => el.click());
      if (verify) {
        if (!open) await verifyVisible(SELECTORS.FILTER_MODAL, false);
        else
          await verifyClass(SELECTORS.FILTER_MODAL, STRINGS.CLASS_ACTIVE, true);
      }
    },

    closeModalEsc: async () =>
      await page.keyboard.press(STRINGS.ESCAPE || 'Escape'),

    applyFilters: async (configs) => {
      for (const { type, value } of configs) {
        await genericFilter(type, value);
      }
      await locate(SELECTORS.APPLY_FILTERS).click();
      await page.waitForTimeout(TIMEOUTS.FILTER_APPLY);
    },

    openDetail: async (index = 0) =>
      await locate(SELECTORS.CARD).nth(index).click(),

    verifyInitialState: async () => {
      await verifyCount(DEFAULTS.MIN_COUNT);
      await verifyText(SELECTORS.PAGE_TITLE, STRINGS.PAGE_TITLE);
      await verifyVisible(SELECTORS.CONTAINER_WIDE);
      const prices = await locate(SELECTORS.CARD_PRICE).allTextContents();
      const hasCurrency = prices.some((p) => p.includes(STRINGS.CURRENCY));
      expect(hasCurrency).toBeTruthy();
      const styles = await getCompStyle(SELECTORS.GRID);
      expect(styles.display).toBe(STRINGS.GRID_DISPLAY);
    },

    verifySearchOutcome: async ({
      minCount,
      matchSel,
      matchText,
      noResults,
    }) => {
      if (noResults) {
        await verifyVisible(SELECTORS.NO_RESULTS);
      } else {
        if (minCount !== undefined) await verifyCount(minCount);
        if (matchSel && matchText) {
          const count = await locate(matchSel).count();
          if (count > 0) {
            await expect(locate(matchSel).first()).toContainText(matchText);
          }
        }
      }
    },

    verifyModalState: async (selector, isOpen) =>
      verifyClass(selector, STRINGS.CLASS_ACTIVE, isOpen),

    verifyFilterLogic: async (minCount) => await verifyCount(minCount),

    verifyDetailContent: async () => {
      const title = await locate(SELECTORS.CARD)
        .first()
        .locator(SELECTORS.CARD_TITLE)
        .textContent();
      await verifyText(SELECTORS.MODAL_BODY_TITLE, title);
    },

    verifyResponsive: async () => {
      const { w, viewport } = await locate(SELECTORS.CONTAINER_WIDE).evaluate(
        (el) => ({
          w: el.getBoundingClientRect().width,
          viewport: window.innerWidth,
        })
      );
      expect(w / viewport).toBeGreaterThan(DIMENSIONS.WIDTH_RATIO_THRESHOLD);

      await page.setViewportSize({
        width: DIMENSIONS.MOBILE_WIDTH,
        height: DIMENSIONS.MOBILE_HEIGHT,
      });
      await verifyCount(DEFAULTS.MIN_COUNT);
    },

    verifyA11y: async () =>
      expect(locate(SELECTORS.SEARCH)).toHaveAttribute(
        ATTRIBUTES.PLACEHOLDER,
        STRINGS.SEARCH_PLACEHOLDER
      ),

    verifyActiveFilter: async () =>
      verifyClass(
        SELECTORS.CUISINE_OPTION(FILTERS.CUISINE_SOUTH),
        STRINGS.CLASS_ACTIVE,
        true
      ),

    verifyCloseLabel: async () =>
      expect(locate(SELECTORS.FILTER_CLOSE)).toHaveAttribute(
        ATTRIBUTES.ARIA_LABEL,
        STRINGS.CLOSE_MODAL_LABEL
      ),
  };
};

test.describe('Explore Page (Real API)', () => {
  let act;

  test.beforeEach(async ({ page }) => {
    act = createHelpers(page);
    await act.navigate();
  });

  test('should pass initial checks', async () =>
    await act.verifyInitialState());

  test('should search by specific term', async () => {
    await act.performSearch(STRINGS.SEARCH_TERM_NAME);
    await act.verifySearchOutcome({ minCount: DEFAULTS.MIN_COUNT });
  });

  test('should show no results for garbage search', async () => {
    await act.performSearch(STRINGS.SEARCH_TERM_INVALID);
    await act.verifySearchOutcome({ noResults: true });
  });

  const SOUTH_FILTER = [{ type: 'cuisine', value: FILTERS.CUISINE_SOUTH }];

  test.describe('Filter Modal', () => {
    test.beforeEach(async () => await act.toggleFilterModal(true, true));

    test('should close filter modal ', async () => {
      await act.toggleFilterModal(false, true);
    });

    test('should apply cuisine filter', async () => {
      await act.applyFilters(SOUTH_FILTER);
      await act.verifyFilterLogic(DEFAULTS.MIN_COUNT);
    });

    test('should verify UI elements', async () => {
      await act.applyFilters(SOUTH_FILTER);
      await act.toggleFilterModal(true);
      await act.verifyActiveFilter();
      await act.verifyCloseLabel();
    });
  });

  test.describe('Detail Modal', () => {
    test.beforeEach(async () => await act.openDetail());
    test('should manage detail modal', async () => {
      await act.verifyModalState(SELECTORS.DETAIL_MODAL, true);
      await act.verifyDetailContent();
      await act.closeModalEsc();
      await act.verifyModalState(SELECTORS.DETAIL_MODAL, false);
    });
  });

  test('should handle layout and a11y', async () => {
    await act.verifyResponsive();
    await act.verifyA11y();
  });
});
