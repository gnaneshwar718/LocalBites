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

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

export const SERVER_DEFAULTS = {
  PORT: PORT,
  KEEP_ALIVE_INTERVAL: 1000000,
};

export const MESSAGES = {
  PASSWORD_MISMATCH: 'Passwords do not match!',
  SIGNUP_SUCCESS: 'Sign up successful! Please sign in.',
  SIGNUP_ERROR: 'An error occurred during sign up.',
  SIGNIN_ERROR: 'An error occurred during sign in.',
  FIELDS_REQUIRED: 'All fields are required',
  USER_EXISTS: 'User already exists',
  USER_CREATED: 'User created successfully',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SIGNIN_SUCCESS: 'Sign in successful',
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
  MTR: 'MTR',
  SOUTH_INDIAN: 'South Indian',
  BREAKFAST: 'breakfast',
};

export const ABOUT_DATA = {
  MISSION:
    'Our mission is to bridge the gap between travelers and authentic local food experiences, celebrating the culture and stories behind every dish.',
  STORY:
    'LocalBites was born in the heart of Bengaluru, inspired by the bustling streets and hidden aromas of family-run eateries that have been serving generations. We realized that while mainstream maps show you where to eat, they often miss the places where the soul of the city truly resides.',
  VISION:
    'We envision a world where every meal is an opportunity for discovery and cultural connection. By putting local legends on the map, we strive to preserve culinary heritage and support the independent artisans who keep our food traditions alive.',
  TEAM: [
    {
      name: 'Rakshitha Banapur',
      role: 'Software developer engineer',
      bio: 'Deeply passionate about preserving cultural narratives through digital design. Dedicated to crafting immersive experiences that bring the soul of local cuisine to life.',
    },
    {
      name: 'Gnaneshwar P',
      role: 'Software developer engineer',
      bio: 'Driven by the power of technology to bridge communities. Focused on building seamless, accessible platforms that turn every search into a meaningful discovery.',
    },
  ],
  FEATURES: [
    {
      title: 'Authenticity',
      description: 'We focus on real local spots favored by residents.',
      icon: 'fas fa-check-circle',
    },
    {
      title: 'Culture',
      description:
        'Learn the history and traditions behind your favorite meals.',
      icon: 'fas fa-history',
    },
    {
      title: 'Community',
      description: 'Join a growing network of food enthusiasts.',
      icon: 'fas fa-users',
    },
  ],
};

export const ABOUT_SELECTORS = {
  TEAM_CONTAINER: '#team-container',
  MISSION_TEXT: '#mission-text',
  STORY_TEXT: '#story-text',
  VISION_TEXT: '#vision-text',
  FEATURES_GRID: '#features-grid',
};
