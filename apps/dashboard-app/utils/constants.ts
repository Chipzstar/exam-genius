import { PhoneNumberUtil } from 'google-libphonenumber';
import * as process from 'process';

export const DOMAIN_URL =
	process.env.DOPPLER_ENVIRONMENT === 'dev'
		? `http://${process.env.VERCEL_URL}`
		: `https://${process.env.VERCEL_URL}`;
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
	TEST_MODE: 'test-mode'
};

export const PATHS = {
	HOME: '/',
	SIGNUP: '/signup',
	LOGIN: '/login',
	PAPERS: '/papers',
	FORGOT_PASSWORD: 'forgot-password',
	SETTINGS: '/settings',
	ONBOARDING: '/onboarding',
	PROFILE: '/profile',
	NEW_SUBJECT: '/choose-subject',
	EXAM_BOARD: '/exam-board',
	MATHS: '/papers/maths',
	PHYSICS: '/papers/physics',
	CHEMISTRY: '/papers/chemistry',
	BIOLOGY: '/papers/biology',
	ECONOMICS: '/papers/economics',
	PSYCHOLOGY: '/papers/psychology',
	VIEW_PAPER: '/view-paper',
};

export const AUTH_ROUTES = [PATHS.LOGIN, PATHS.SIGNUP, PATHS.FORGOT_PASSWORD];

export const SUBJECT_PAPERS : Record<string, Record<string, {label: string, icon: string, modules: string[]}>> = {
	maths: {
		['pure-maths']: { label: 'Pure Maths', icon: '/static/images/pure-maths-icon.svg', modules: ['PM1', 'PM2'] },
		stats: { label: 'Statistics & Mechanics', icon: '/static/images/statistics-icon.svg', modules: ['Statistics & Mechanics'] }
	}
};

export const SUBJECT_PRICE_IDS = {
	maths: 'price_1MvKQDJOIoW2Wbjc4n53kNHm',
	physics: 'price_1MvLKNJOIoW2WbjcvHxNAJ0o',
    chemistry: 'price_1MvLJkJOIoW2WbjcHFPFOiOG',
    biology: 'price_1MvLIbJOIoW2WbjcWFXrYiHO',
	economics: 'price_1MvLMTJOIoW2Wbjc7C0kOdwc',
    psychology: 'price_1MvLL0JOIoW2WbjcdjRS8C3h'
}

export const PAPER_PRICE_IDS = {
	maths: 'price_1MvNNdJOIoW2WbjczSvv3fBH',
}

// export type PRICE_ID = SUBJECT_PRICE_IDS[keyof SUBJECT_PRICE_IDS]
