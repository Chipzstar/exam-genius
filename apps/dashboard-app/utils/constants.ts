import { PhoneNumberUtil } from 'google-libphonenumber';

export const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
];

export const phoneUtil = PhoneNumberUtil.getInstance();
export const ONE_GB = 1073741824; // in bytes units
export const FIVE_MB = 5242880; // in bytes units
export const TEN_MB = 2 * FIVE_MB; // in bytes units
export const UNDER_TWENTY_FIVE_MB = 24900000; // 24.9 MB
export const FIVE_HUNDRED_POUNDS = 50000;
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_API_KEY;
export const DEFAULT_HEADER_HEIGHT = 75;
export const BANNER_HEIGHT = 65;

export const STORAGE_KEYS = {
  ACCOUNT: 'account',
  SIGNUP_FORM: 'signup-form',
  ONBOARDING_STEP: 'onboarding-step',
  TEST_MODE: 'test-mode',
};

export const PATHS = {
  HOME: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  PAPERS: '/papers',
  FORGOT_PASSWORD: 'forgot-password',
  SETTINGS: '/settings',
  ONBOARDING: '/onboarding'
};

export const AUTH_ROUTES = [
  PATHS.LOGIN,
  PATHS.SIGNUP,
  PATHS.FORGOT_PASSWORD
];
