const LOCAL_ORIGIN = typeof process !== 'undefined' && process.env.LOCAL_ORIGIN;

export const TEST_LOCATION_URL = LOCAL_ORIGIN;

export const TEST_USER = {
  name: typeof process !== 'undefined' && process.env.TEST_USER_NAME,
  email: typeof process !== 'undefined' && process.env.TEST_USER_EMAIL,
  password: typeof process !== 'undefined' && process.env.TEST_USER_PASSWORD,
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

export const TEST_TIMEOUTS = {
  SEARCH_DELAY: 2000,
  NAVIGATION: 30000,
  FILTER_APPLY: 1000,
};

export const TEST_DIMENSIONS = {
  MOBILE_WIDTH: 375,
  MOBILE_HEIGHT: 667,
  WIDTH_RATIO_THRESHOLD: 0.9,
};

export const TEST_DEFAULTS = {
  MIN_COUNT: 1,
};

export const TIMINGS = {
  SETUP_DELAY: 50,
  SCROLL_DELAY: 200,
  CAROUSEL_ADVANCE: 4000,
  LOOP_COUNT: 20,
};

export const MOCK_CULTURE_DATA = {
  restaurants: {
    mtr: {
      id: 'mtr',
      name: 'Mavalli Tiffin Rooms',
      location: 'https://maps.google.com/?q=MTR',
    },
    ctr: {
      id: 'ctr',
      name: 'CTR - Shri Sagar',
      location: 'https://maps.google.com/?q=CTR',
    },
    'vidyarthi-bhavan': {
      id: 'vidyarthi-bhavan',
      name: 'Vidyarthi Bhavan',
      location: 'https://maps.google.com/?q=vidyarthi',
    },
    'halli-mane': {
      id: 'halli-mane',
      name: 'Halli Mane',
      location: 'https://maps.google.com/?q=hallimane',
    },
    maiyas: {
      id: 'maiyas',
      name: 'Maiyas',
      location: 'https://maps.google.com/?q=maiyas',
    },
    'meghana-foods': {
      id: 'meghana-foods',
      name: 'Meghana Foods',
      location: 'https://maps.google.com/?q=meghana',
    },
    nagarjuna: {
      id: 'nagarjuna',
      name: 'Nagarjuna',
      location: 'https://maps.google.com/?q=nagarjuna',
    },
  },
  dishes: {
    d1: {
      id: 'd1',
      name: 'Dish 1',
      description: 'Desc 1',
      restaurants: ['mtr'],
    },
    d2: {
      id: 'd2',
      name: 'Dish 2',
      description: 'Desc 2',
      restaurants: ['ctr'],
    },
    d3: {
      id: 'd3',
      name: 'Dish 3',
      description: 'Desc 3',
      restaurants: ['vidyarthi-bhavan'],
    },
    d4: {
      id: 'd4',
      name: 'Dish 4',
      description: 'Desc 4',
      restaurants: ['halli-mane'],
    },
    d5: {
      id: 'd5',
      name: 'Dish 5',
      description: 'Desc 5',
      restaurants: ['maiyas'],
    },
    d6: {
      id: 'd6',
      name: 'Dish 6',
      description: 'Desc 6',
      restaurants: ['meghana-foods'],
    },
    d7: {
      id: 'd7',
      name: 'Dish 7',
      description: 'Desc 7',
      restaurants: ['nagarjuna'],
    },
  },
};

export const TEST_WAIT_TIME = 50;
export const TEST_CONSTANTS = {
  FIRST_INDEX: 0,
  UTF8: 'utf-8',
  DOM_CONTENT_LOADED: 'DOMContentLoaded',
  TEAM_CARD_SELECTOR: '.team-card',
  FEATURE_CARD_SELECTOR: '.feature-card',
  H3_TAG: 'h3',
};
