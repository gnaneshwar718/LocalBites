import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RESTAURANTS } from '../data/restaurants.js';
import {
    EXPLORE_SELECTORS as SELECTORS,
    EXPLORE_CLASSES as CLASSES,
    EVENTS,
    EXPLORE_ATTRIBUTES as ATTRIBUTES,
    EXPLORE_TEXTS as TEXTS,
    PATHS
} from './constants/constants.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getElementById = (id) => document.getElementById(id);
const querySelector = (selector) => document.querySelector(selector);
const querySelectorAll = (selector) => document.querySelectorAll(selector);

const getElements = () => ({
    searchInput: getElementById(SELECTORS.SEARCH_INPUT),
    filterBtn: getElementById(SELECTORS.FILTER_BTN),
    filterModal: getElementById(SELECTORS.FILTER_MODAL),
    applyBtn: getElementById(SELECTORS.APPLY_FILTERS_BTN),
    detailModal: getElementById(SELECTORS.DETAIL_MODAL),
    modalBody: getElementById(SELECTORS.MODAL_BODY),
    cuisineFilters: getElementById(SELECTORS.CUISINE_FILTERS),
    mealTypeFilters: getElementById(SELECTORS.MEAL_TYPE_FILTERS),
    cards: () => querySelectorAll(SELECTORS.RESTAURANT_CARD)
});

const triggerEvent = (element, eventType) => {
    eventType === EVENTS.CLICK ? element.click() : element.dispatchEvent(new Event(eventType));
};

const pressKey = (key) => {
    document.dispatchEvent(new KeyboardEvent(EVENTS.KEYDOWN, { key }));
};

const expectElementCount = (count) => {
    expect(getElements().cards().length).toBe(count);
};

const expectClassOnElement = (element, className, shouldHave) => {
    expect(element.classList.contains(className)).toBe(shouldHave);
};

const selectFilterChip = (container, attribute, value) => {
    const chip = container.querySelector(`[${attribute}="${value}"]`);
    if (chip) triggerEvent(chip, EVENTS.CLICK);
};

const verifySearch = (value, expectedCountOrSelector) => {
    const { searchInput } = getElements();
    searchInput.value = value;
    triggerEvent(searchInput, EVENTS.INPUT);
    const isNumber = typeof expectedCountOrSelector === 'number';
    isNumber
        ? expectElementCount(expectedCountOrSelector)
        : expect(querySelector(expectedCountOrSelector)).toBeTruthy();
};

const verifyModalToggle = (triggerElement, modalElement, closeAction) => {
    const checkActive = (state) => expectClassOnElement(modalElement, CLASSES.ACTIVE, state);
    checkActive(false);
    triggerEvent(triggerElement, EVENTS.CLICK);
    checkActive(true);
    if (closeAction) {
        closeAction();
        checkActive(false);
    }
};

const verifyFilter = (container, attribute, value, expectedCount) => {
    selectFilterChip(container, attribute, value);
    triggerEvent(getElements().applyBtn, EVENTS.CLICK);
    expectElementCount(expectedCount);
};

const verifyContentMatch = (selector, text) => {
    expect(querySelector(selector).textContent).toContain(text);
};

describe("Explore Page Comprehensive Tests", () => {
    let exploreInstance;
    beforeAll(() => {
        const htmlPath = path.join(__dirname, ...PATHS.EXPLORE_HTML);
        global.htmlContent = fs.readFileSync(htmlPath, "utf-8");
    });

    beforeEach(async () => {
        document.documentElement.innerHTML = global.htmlContent;
        process.env.NODE_ENV = 'test';
        const module = await import('./explore.js');
        exploreInstance = new module.ExplorePage();
        exploreInstance.restaurants = RESTAURANTS;
        exploreInstance.renderRestaurants();
    });

    describe("Initial State", () => {
        test("renders all initial restaurants", () => {
            expectElementCount(RESTAURANTS.length);
            verifyContentMatch(SELECTORS.PAGE_TITLE, TEXTS.PAGE_HEADER);
        });
        test("prices use Indian Rupee symbol", () => {
            RESTAURANTS.length > 0 && verifyContentMatch(SELECTORS.CARD_PRICE, TEXTS.CURRENCY);
        });
    });

    describe("Search Functionality", () => {
        const target = RESTAURANTS[0];
        test("filters by name", () => {
            verifySearch(target.name.split(' ')[0], 1);
            verifyContentMatch(`${SELECTORS.RESTAURANT_CARD} ${SELECTORS.CARD_TITLE}`, target.name);
        });
        test("filters by cuisine", () => {
            const count = RESTAURANTS.filter(r => r.cuisine.toLowerCase().includes(target.cuisine.toLowerCase())).length;
            verifySearch(target.cuisine, count);
            verifyContentMatch(`${SELECTORS.RESTAURANT_CARD} ${SELECTORS.CARD_CUISINE}`, target.cuisine);
        });
        test("shows no-results message for invalid search", () => {
            verifySearch(TEXTS.NO_EXISTENT, SELECTORS.NO_RESULTS);
        });
    });

    describe("Filter Modal", () => {
        test("toggles filter modal", () => {
            const { filterBtn, filterModal } = getElements();
            verifyModalToggle(filterBtn, filterModal);
        });
        test("filters by cuisine chip", () => {
            const { cuisineFilters } = getElements();
            const count = RESTAURANTS.filter(r => r.cuisine === TEXTS.SOUTH_INDIAN).length;
            verifyFilter(cuisineFilters, ATTRIBUTES.DATA_CUISINE, TEXTS.SOUTH_INDIAN, count);
        });
        test("filters by meal type", () => {
            const { mealTypeFilters } = getElements();
            const count = RESTAURANTS.filter(r => r.mealType.includes(TEXTS.BREAKFAST)).length;
            verifyFilter(mealTypeFilters, ATTRIBUTES.DATA_MEALTYPE, TEXTS.BREAKFAST, count);
        });
    });

    describe("Combined Multi-Filtering", () => {
        test("search + cuisine + meal type", () => {
            const target = RESTAURANTS.find(r => r.name.includes(TEXTS.MTR));
            if (!target) return;
            const { cuisineFilters, mealTypeFilters, searchInput } = getElements();
            searchInput.value = TEXTS.MTR;
            triggerEvent(searchInput, EVENTS.INPUT);
            selectFilterChip(cuisineFilters, ATTRIBUTES.DATA_CUISINE, target.cuisine);
            selectFilterChip(mealTypeFilters, ATTRIBUTES.DATA_MEALTYPE, target.mealType[0]);
            triggerEvent(getElements().applyBtn, EVENTS.CLICK);
            expectElementCount(1);
            verifyContentMatch(`${SELECTORS.RESTAURANT_CARD} ${SELECTORS.CARD_TITLE}`, target.name);
        });
    });

    describe("Detail Modal", () => {
        test("opens detail modal with correct content", () => {
            const { detailModal } = getElements();
            verifyModalToggle(querySelector(SELECTORS.RESTAURANT_CARD), detailModal);
            verifyContentMatch(`#${SELECTORS.MODAL_BODY}`, RESTAURANTS[0].name);
        });

        test("closes modal via ESC key", () => {
            const { detailModal } = getElements();
            verifyModalToggle(
                querySelector(SELECTORS.RESTAURANT_CARD),
                detailModal,
                () => pressKey(EVENTS.ESCAPE)
            );
        });
    });
});
