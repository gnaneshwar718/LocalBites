const LOCAL_ORIGIN = 'http://localhost';

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
};

export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};
