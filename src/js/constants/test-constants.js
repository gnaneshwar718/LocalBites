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

export const RESTAURANTS = [
  {
    id: '1',
    name: 'Vidyarthi Bhavan',
    cuisine: 'South Indian',
    mealType: ['breakfast', 'lunch'],
    price: 150,
    rating: 4.5,
    reviews: 2000,
    location: 'Basavanagudi',
    image: 'vb.jpg',
    priceString: '₹150',
  },
  {
    id: '2',
    name: 'MTR',
    cuisine: 'South Indian',
    mealType: ['breakfast', 'lunch', 'dinner'],
    price: 250,
    rating: 4.4,
    reviews: 1500,
    location: 'Lalbagh',
    image: 'mtr.jpg',
    priceString: '₹250',
  },
  {
    id: '3',
    name: 'Truffles',
    cuisine: 'Burger',
    mealType: ['lunch', 'dinner'],
    price: 350,
    rating: 4.3,
    reviews: 1200,
    location: 'Koramangala',
    image: 'truffles.jpg',
    priceString: '₹350',
  },
];

export const MOCK_RESTAURANTS = {
  places: [
    {
      name: 'resources/places/12345',
      id: '12345',
      types: [
        'restaurant',
        'south_indian_restaurant',
        'food',
        'point_of_interest',
        'establishment',
      ],
      formattedAddress: 'Basavanagudi, Bengaluru',
      location: { latitude: 12.9431, longitude: 77.5736 },
      rating: 4.5,
      userRatingCount: 2500,
      displayName: { text: 'Vidyarthi Bhavan', languageCode: 'en' },
      priceLevel: 'PRICE_LEVEL_INEXPENSIVE',
    },
    {
      name: 'resources/places/67890',
      id: '67890',
      types: [
        'restaurant',
        'indian_restaurant',
        'food',
        'point_of_interest',
        'establishment',
      ],
      formattedAddress: 'Lalbagh Road, Bengaluru',
      location: { latitude: 12.9566, longitude: 77.5869 },
      rating: 4.4,
      userRatingCount: 1800,
      displayName: { text: 'MTR', languageCode: 'en' },
      priceLevel: 'PRICE_LEVEL_MODERATE',
    },
  ],
};

export const AUTH_SELECTORS = {
  CONTAINER: '#container',
  SIGN_UP_BTN: '#signUp',
  SIGN_IN_BTN: '#signIn',
  MOBILE_SIGN_UP_BTN: '#mobile-signUp',
  MOBILE_SIGN_IN_BTN: '#mobile-signIn',
  PANEL_ACTIVE: '.right-panel-active',
  SIGN_IN_FORM: '#signin-form',
  SIGN_UP_FORM: '#signup-form',
  SIGN_UP_NAME: '#signup-name',
  SIGN_UP_EMAIL: '#signup-email',
  SIGN_UP_PASSWORD: '#signup-password',
  SIGN_UP_RETYPE: '#signup-retype-password',
  SIGN_IN_EMAIL: '#signin-email',
  SIGN_IN_PASSWORD: '#signin-password',
  SUBMIT_BTN: 'button[type="submit"]',
  SIGN_UP_MESSAGE: '#signup-message',
  SIGN_IN_MESSAGE: '#signin-message',
};
