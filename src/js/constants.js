const LOCAL_ORIGIN = typeof process !== 'undefined' && process.env.LOCAL_ORIGIN;

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
  name: typeof process !== 'undefined' && process.env.TEST_USER_NAME,
  email: typeof process !== 'undefined' && process.env.TEST_USER_EMAIL,
  password: typeof process !== 'undefined' && process.env.TEST_USER_PASSWORD,
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

export const ROUTES = {
  EXPLORE: '/explore',
};

export const TEST_SELECTORS = {
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

export const TEST_ATTRIBUTES = {
  ARIA_LABEL: 'aria-label',
  PLACEHOLDER: 'placeholder',
};

export const TEST_STRINGS = {
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

export const TEST_FILTERS = {
  CUISINE_SOUTH: 'South Indian',
  MEAL_BREAKFAST: 'breakfast',
};
