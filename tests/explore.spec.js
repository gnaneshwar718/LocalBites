import { test, expect } from '@playwright/test';
import { ROUTES } from '../src/js/constants.js';
import {
  TEST_SELECTORS as SELECTORS,
  TEST_ATTRIBUTES as ATTRIBUTES,
  TEST_STRINGS as STRINGS,
  TEST_FILTERS as FILTERS,
} from '../src/js/test-constants.js';

const createHelpers = (page) => {
  const locate = (selector) => page.locator(selector);

  const verifyCount = async (count) =>
    expect(locate(SELECTORS.CARD)).toHaveCount(count);

  const verifyVisible = async (selector) =>
    expect(locate(selector)).toBeVisible();

  const verifyText = async (selector, text) =>
    expect(locate(selector)).toContainText(text);

  const verifyClass = async (selector, cls, has = true) => {
    const assertion = expect(locate(selector));
    await (has ? assertion : assertion.not).toHaveClass(cls);
  };

  const genericSearch = async (term) =>
    await locate(SELECTORS.SEARCH).fill(term);

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
        align: s.alignItems,
        justify: s.justifyContent,
        columns: s.gridTemplateColumns,
      };
    });
  };

  return {
    navigate: async () => {
      await page.goto(ROUTES.EXPLORE);
      await page.waitForLoadState('networkidle');
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
    },

    openDetail: async (index = 0) =>
      await locate(SELECTORS.CARD).nth(index).click(),

    verifyInitialState: async () => {
      await verifyCount(6);
      await verifyText(SELECTORS.PAGE_TITLE, STRINGS.PAGE_TITLE);
      await verifyVisible(SELECTORS.CONTAINER_WIDE);

      const prices = await locate(SELECTORS.CARD_PRICE).allTextContents();
      prices.forEach((p) => expect(p).toContain(STRINGS.CURRENCY));

      const styles = await getCompStyle(SELECTORS.GRID);
      expect(styles.display).toBe(STRINGS.GRID_DISPLAY);
      expect(styles.columns.split(' ').length).toBeGreaterThan(1);
    },

    verifySearchOutcome: async ({ count, matchSel, matchText, noResults }) => {
      if (count !== undefined) await verifyCount(count);
      if (matchSel && matchText) await verifyText(matchSel, matchText);
      if (noResults) {
        await verifyVisible(SELECTORS.NO_RESULTS);
        await verifyText(SELECTORS.NO_RESULTS, STRINGS.NO_RESULTS_MSG);
      }
    },

    verifyModalState: async (selector, isOpen) =>
      verifyClass(selector, STRINGS.CLASS_ACTIVE, isOpen),

    verifyFilterLogic: async (count) => await verifyCount(count),

    verifyDetailContent: async () => {
      const title = await locate(SELECTORS.CARD)
        .first()
        .locator(SELECTORS.CARD_TITLE)
        .textContent();
      await verifyText(SELECTORS.MODAL_BODY_TITLE, title);
      expect(locate(SELECTORS.MODAL_PRICE)).toContainText(STRINGS.CURRENCY);

      const styles = await getCompStyle(SELECTORS.DETAIL_MODAL);
      expect(styles.display).toBe(STRINGS.FLEX);
      expect(styles.align).toBe(STRINGS.CENTER);
      expect(styles.justify).toBe(STRINGS.CENTER);
    },

    verifyResponsive: async () => {
      const { w, viewport } = await locate(SELECTORS.CONTAINER_WIDE).evaluate(
        (el) => ({
          w: el.getBoundingClientRect().width,
          viewport: window.innerWidth,
        })
      );
      expect(w / viewport).toBeGreaterThan(0.9);

      await page.setViewportSize({ width: 375, height: 667 });
      await verifyCount(6);
      await verifyVisible(SELECTORS.GRID);
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

test.describe('Explore Page', () => {
  let act;

  test.beforeEach(async ({ page }) => {
    act = createHelpers(page);
    await act.navigate();
  });

  test('should pass initial checks', async () =>
    await act.verifyInitialState());

  const searchTests = [
    {
      name: 'name',
      term: STRINGS.SEARCH_TERM_NAME,
      count: 1,
      matchSel: `${SELECTORS.CARD} ${SELECTORS.CARD_TITLE}`,
      matchText: STRINGS.MATCHED_NAME,
    },
    {
      name: 'cuisine',
      term: STRINGS.SEARCH_TERM_CUISINE,
      count: 1,
      matchSel: `${SELECTORS.CARD} ${SELECTORS.CARD_CUISINE}`,
      matchText: STRINGS.MATCHED_CUISINE,
    },
    { name: 'case', term: STRINGS.SEARCH_TERM_CASE, count: 1 },
    { name: 'invalid', term: STRINGS.SEARCH_TERM_INVALID, noResults: true },
  ];

  for (const s of searchTests) {
    test(`should search by ${s.name}`, async () => {
      await act.performSearch(s.term);
      await act.verifySearchOutcome(s);
    });
  }

  const SOUTH_FILTER = [{ type: 'cuisine', value: FILTERS.CUISINE_SOUTH }];

  test.describe('Filter Modal', () => {
    test.beforeEach(async () => await act.toggleFilterModal(true, true));

    test.fixme('should close filter modal when close button is clicked', async () => {
      await act.toggleFilterModal(false, true);
    });

    test.fixme('should close filter modal when ESC key is pressed', async () => {
      await act.verifyModalState(SELECTORS.FILTER_MODAL, true);
      await act.closeModalEsc();
      await act.verifyVisible(SELECTORS.FILTER_MODAL, false);
    });

    const filterTests = [
      {
        name: 'cuisine',
        cfg: [{ type: 'cuisine', value: FILTERS.CUISINE_SOUTH }],
        count: 2,
      },
      {
        name: 'meal',
        cfg: [{ type: 'meal', value: FILTERS.MEAL_BREAKFAST }],
        count: 4,
      },
      {
        name: 'combined',
        cfg: [
          { type: 'cuisine', value: FILTERS.CUISINE_SOUTH },
          { type: 'meal', value: FILTERS.MEAL_BREAKFAST },
        ],
        count: 2,
      },
    ];

    for (const f of filterTests) {
      test(`should filter by ${f.name}`, async () => {
        await act.applyFilters(f.cfg);
        await act.verifyFilterLogic(f.count);
      });
    }

    test('should verify UI elements', async () => {
      await act.applyFilters(SOUTH_FILTER);
      await act.toggleFilterModal(true);
      await act.verifyActiveFilter();
      await act.verifyCloseLabel();
    });
  });

  test('should handle combined search and filter', async () => {
    await act.performSearch(STRINGS.SEARCH_ROOMS);
    await act.toggleFilterModal(true);
    await act.applyFilters(SOUTH_FILTER);
    await act.verifyFilterLogic(1);
    await act.verifySearchOutcome({
      matchSel: `${SELECTORS.CARD} ${SELECTORS.CARD_TITLE}`,
      matchText: STRINGS.COMBINED_RESULT,
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
