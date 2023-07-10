import { Subject } from '@exam-genius/shared/utils';

export const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';
export const PORT = process.env.PORT || String(4200);

export const TWO_MINUTES = 1000 * 60 * 2;
export const requirements = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
];

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
	COURSE: '/course',
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
	FAQ: '/faq'

};

export const AUTH_ROUTES = [PATHS.LOGIN, PATHS.SIGNUP, PATHS.FORGOT_PASSWORD];

export const SUBJECT_STRIPE_IDS = {
	maths: {
		edexcel: String(process.env.EDEXCEL_MATHS_COURSE_PRICE_ID),
		aqa: String(process.env.AQA_MATHS_COURSE_PRICE_ID),
		ocr: String(process.env.OCR_MATHS_COURSE_PRICE_ID)
	},
	physics: {
		edexcel: String(process.env.EDEXCEL_PHYSICS_COURSE_PRICE_ID),
		aqa: String(process.env.AQA_PHYSICS_COURSE_PRICE_ID),
		ocr: String(process.env.OCR_PHYSICS_COURSE_PRICE_ID)
	},
	chemistry: {
		edexcel: String(process.env.EDEXCEL_CHEMISTRY_COURSE_PRICE_ID),
		aqa: String(process.env.AQA_CHEMISTRY_COURSE_PRICE_ID),
		ocr: String(process.env.OCR_CHEMISTRY_COURSE_PRICE_ID)
	},
	biology: {
		edexcel: String(process.env.EDEXCEL_BIOLOGY_COURSE_PRICE_ID),
		aqa: String(process.env.AQA_BIOLOGY_COURSE_PRICE_ID),
		ocr: String(process.env.OCR_BIOLOGY_COURSE_PRICE_ID)
	},
	economics: {
		edexcel: String(process.env.EDEXCEL_ECONOMICS_COURSE_PRICE_ID),
		aqa: String(process.env.AQA_ECONOMICS_COURSE_PRICE_ID),
		ocr: String(process.env.OCR_ECONOMICS_COURSE_PRICE_ID)
	},
	psychology: {
		edexcel: String(process.env.EDEXCEL_PSYCHOLOGY_COURSE_PRICE_ID),
		aqa: String(process.env.AQA_PSYCHOLOGY_COURSE_PRICE_ID),
		ocr: String(process.env.OCR_PSYCHOLOGY_COURSE_PRICE_ID)
	}
};

export const PAPER_PRICE_IDS: Record<Subject, string> = {
	maths: String(process.env.MATHS_PAPER_PRICE_ID),
	biology: String(process.env.BIOLOGY_PAPER_PRICE_ID),
	physics: String(process.env.PHYSICS_PAPER_PRICE_ID),
	chemistry: String(process.env.CHEMISTRY_PAPER_PRICE_ID),
	economics: String(process.env.ECONOMICS_PAPER_PRICE_ID),
	psychology: String(process.env.PSYCHOLOGY_PAPER_PRICE_ID)
};

export enum CHECKOUT_TYPE {
	COURSE = 'course',
	PAPER = 'paper'
}
