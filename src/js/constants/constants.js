const LOCAL_ORIGIN = typeof process !== 'undefined' && process.env.LOCAL_ORIGIN;
const PORT = typeof process !== 'undefined' && process.env.PORT;

export const BASE_URL = `${LOCAL_ORIGIN}:${PORT}`;
export const TEST_LOCATION_URL = LOCAL_ORIGIN;

export const GOOGLE_MAPS_CHECK_INTERVAL = 100;
export const CAROUSEL_INTERVAL = 4000;
export const REDIRECT_DELAY = 1500;
export const PANEL_TOGGLE_DELAY = 2000;
export const COPYRIGHT_TEXT =
  'Copyright &copy; 2026 by LocalBites, All Rights Reserved';

export const CLASSNAMES = {
  ACTIVE: 'right-panel-active',
};

export const MESSAGES = {
  PASSWORD_MISMATCH: 'Passwords do not match!',
  SIGNUP_SUCCESS: 'Sign up successful! Please sign in.',
  SIGNUP_ERROR: 'An error occurred during sign up.',
  SIGNIN_ERROR: 'An error occurred during sign in.',
};

export const SELECTORS = {
  CONTACT_LINKS: '#footer-contact-link, #faq-contact-link',
  COPYRIGHT: '#footer-copyright',
  HAMBURGER: '.hamburger',
  NAV_LINKS: '.nav-links',
};

export const EXPLORE_SELECTORS = {
  SEARCH_INPUT: 'restaurantSearch',
  FILTER_BTN: 'filterBtn',
  FILTER_MODAL: 'filterModal',
  APPLY_FILTERS_BTN: 'applyFiltersBtn',
  DETAIL_MODAL: 'detailModal',
  MODAL_BODY: 'modalBody',
  CUISINE_FILTERS: 'cuisineFilters',
  MEAL_TYPE_FILTERS: 'mealTypeFilters',
  RESTAURANT_CARD: '.restaurant-card',
  NO_RESULTS: '.no-results',
  CARD_PRICE: '.card-price',
  CARD_CUISINE: '.card-cuisine',
  CARD_TITLE: 'h3',
  PAGE_TITLE: 'h1',
};

export const EXPLORE_CLASSES = {
  ACTIVE: 'active',
};

export const EVENTS = {
  INPUT: 'input',
  CLICK: 'click',
  KEYDOWN: 'keydown',
  ESCAPE: 'Escape',
};

export const EXPLORE_ATTRIBUTES = {
  DATA_CUISINE: 'data-cuisine',
  DATA_MEALTYPE: 'data-mealtype',
};

export const EXPLORE_TEXTS = {
  PAGE_HEADER: 'Popular Local Discoveries',
  CURRENCY: '₹',
  NO_EXISTENT: 'NonExistentPlaceXYZ123',
  SOUTH_INDIAN: 'South Indian',
  BREAKFAST: 'breakfast',
};

export const LIMIT = 6;
export const HERO_DATA = [
  {
    t: 'The Iconic Breakfast',
    h: 'Masala Dosa',
    d: 'A crispy, golden fermented crepe filled with spiced potatoes.',
  },
  {
    t: 'The Spicy Comfort',
    h: 'Bisi Bele Bath',
    d: "A wholesome 'hot lentil rice' dish with vegetables and spices.",
  },
  {
    t: 'The Royal Feast',
    h: 'Biryani',
    d: 'Fragrant rice layered with spiced meat or vegetables.',
  },
  {
    t: 'The Rural Roots',
    h: 'Ragi Mudde',
    d: 'Nutritious finger millet balls paired with spicy curries.',
  },
  {
    t: 'The Perfect Duo',
    h: 'Idli Vada',
    d: 'Soft steamed rice cakes paired with crispy lentil donuts.',
  },
  {
    t: 'The Soul',
    h: 'Filter Coffee',
    d: 'Strong, aromatic coffee brewed in traditional filters.',
  },
];

export const POPULAR_THRESHOLDS = {
  MIN_RATING: 4.2,
  MIN_REVIEWS: 1000,
};

export const ANIMATION_TIMINGS = {
  HERO_TEXT_FADE_OUT: 500,
  HERO_TEXT_TRANSITION_BASE: 0.6,
  HERO_TEXT_TRANSITION_DELAY: 0.1,
  DISH_HIGHLIGHT_DURATION: 3000,
  DISH_SCROLL_DELAY: 150,
  HASH_SCROLL_DELAY: 100,
};
