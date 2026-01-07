const LOCAL_ORIGIN =
  (typeof process !== 'undefined' && process.env.LOCAL_ORIGIN) ||
  'http://localhost';

export const TEST_LOCATION_URL = LOCAL_ORIGIN;
export const BASE_URL = `${LOCAL_ORIGIN}:3000`;

export const CLASSNAMES = {
  ACTIVE: 'right-panel-active',
};

export const ENDPOINTS = {
  SIGNUP: '/signup',
  SIGNIN: '/signin',
};

export const MESSAGES = {
  PASSWORD_MISMATCH: 'Passwords do not match!',
  SIGNUP_SUCCESS: 'Sign up successful! Please sign in.',
  SIGNUP_ERROR: 'An error occurred during sign up.',
  SIGNIN_ERROR: 'An error occurred during sign in.',
};

export const PATHS = {
  AUTH_HTML: '../../public/pages/auth.html',
  EXPLORE_HTML: ['..', '..', 'public', 'pages', 'explore.html'],
};

export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
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
  MTR: 'MTR',
  SOUTH_INDIAN: 'South Indian',
  BREAKFAST: 'breakfast',
};
