const LOCAL_ORIGIN = 'http://localhost';

export const TEST_LOCATION_URL = LOCAL_ORIGIN;
export const BASE_URL = `${LOCAL_ORIGIN}:3000`;

export const CLASSNAMES = {
  ACTIVE: 'right-panel-active',
};

export const PATHS = {
  AUTH_HTML: '../../public/pages/auth.html',
  HEADER_PARTIAL: '/partials/header.html',
  FOOTER_PARTIAL: '/partials/footer.html',
  FAQ_PARTIAL: '/partials/faq.html',
};

export const ENDPOINTS = {
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  CONFIG: '/api/config',
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

export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

export const CAROUSEL_INTERVAL = 4000;
