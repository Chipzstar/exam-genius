import { PhoneNumberUtil } from 'google-libphonenumber';
import * as process from 'process';
import { CourseInfo, ExamBoard, Subject } from './types';

export const PORT = process.env.PORT || String(4200);
export const DOMAIN_URL =
	process.env.DOPPLER_ENVIRONMENT === 'dev'
		? `http://localhost:${process.env.PORT}`
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
	VIEW_PAPER: '/view-paper'
};

export const AUTH_ROUTES = [PATHS.LOGIN, PATHS.SIGNUP, PATHS.FORGOT_PASSWORD];

export const SUBJECT_PAPERS: Record<Subject, Record<ExamBoard, Record<string, CourseInfo>>> = {
	maths: {
		edexcel: {
			['pure-maths']: {
				label: 'Pure Maths',
				icon: '/static/images/pure-maths-icon.svg',
				papers: [
					{
						href: 'PM1',
						name: 'Pure Maths 1',
						num_questions: 16,
						marks: 100
					},
					{
						href: 'PM2',
						name: 'Pure Maths 2',
						num_questions: 16,
						marks: 100
					}
				]
			},
			['stats-and-mechanics']: {
				label: 'Statistics & Mechanics',
				icon: '/static/images/statistics-icon.svg',
				papers: [
					{
						href: 'statistics',
						name: 'Statistics',
						num_questions: 5,
						marks: 30
					},
					{
						href: 'mechanics',
						name: 'Mechanics',
						num_questions: 5,
						marks: 50
					}
				]
			}
		},
		aqa: {
			['paper-1']: {
				label: 'Paper 1',
				icon: '/static/images/maths-icon.svg',
				papers: [
					{
						href: 'paper-1',
						name: 'Paper 1',
						num_questions: 15,
						marks: 100
					}
				]
			},
			['paper-2']: {
				label: 'Paper 2',
				icon: '/static/images/statistics-icon.svg',
				papers: [
					{
						href: 'paper-2',
						name: 'Paper 2',
						num_questions: 19,
						marks: 100
					}
				]
			},
			['paper-3']: {
				label: 'Paper 3',
				icon: '/static/images/statistics-icon.svg',
				papers: [
					{
						href: 'paper-3',
						name: 'Paper 3',
						num_questions: 18,
						marks: 100
					}
				]
			}
		},
		ocr: {
			['maths-a']: {
				label: 'Mathematics - A',
				icon: '/static/images/maths-icon.svg',
				papers: [
					{
						href: 'pure-maths',
						name: 'Pure Maths',
						num_questions: 12,
						marks: 100
					},
					{
						href: 'pure-maths-stats',
						name: 'Pure Maths and Statistics',
						num_questions: 14,
						marks: 100
					},
					{
						href: 'pure-maths-mechanics',
						name: 'Pure Maths and Mechanics',
						num_questions: 14,
						marks: 100
					}
				]
			},
			['maths-b']: {
				label: 'Mathematics - B (MEI)',
				icon: '/static/images/maths-icon.svg',
				papers: [
					{
						href: 'pure-maths-mechanics',
						name: 'Pure Maths and Mechanics',
						num_questions: 13,
						marks: 100
					},
					{
						href: 'pure-maths-stats',
						name: 'Pure Maths and Statistics',
						num_questions: 16,
						marks: 100
					},
					{
						href: 'pure-maths-comprehension',
						name: 'Pure Maths and Comprehension',
						num_questions: 15,
						marks: 75
					}
				]
			}
		}
	},
	economics: {
		edexcel: {
			['economics-a']: {
				label: 'Economics - A',
				icon: '/static/images/economics-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1: Markets and Business Behaviour',
                    num_questions: 8,
                    marks: 100
				}, {
					href: 'paper-2',
					name: 'Paper 2: The National and Global Economy',
					num_questions: 8,
					marks: 100
				}, {
					href: 'paper-3',
					name: 'Paper 3: Microeconomics and Macroeconomics',
					num_questions: 2,
					marks: 100
				}]
			},
			['economics-b']: {
				label: 'Economics - B',
				icon: '/static/images/economics-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1: Markets and how they work',
					num_questions: 3,
					marks: 100
				}, {
					href: 'paper-2',
					name: 'Paper 2: Competing in the global economy',
					num_questions: 3,
					marks: 100
				}, {
					href: 'paper-3',
					name: 'Paper 3: The economic environment and business',
					num_questions: 2,
					marks: 100
				}]
			}
		},
		ocr: {
			microeconomics: {
				label: 'Paper 1',
				icon: '/static/images/microeconomics-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Microeconomics',
					num_questions: 5,
                    marks: 80
				}]
			},
			macroeconomics: {
				label: 'Paper 2',
				icon: '/static/images/macroeconomics-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Macroeconomics',
					num_questions: 5,
					marks: 80
				}]
			},
			themes: {
				label: 'Paper 3',
				icon: '/static/images/economics-themes-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Themes in Economics',
					num_questions: 37,
					marks: 80,
				}]
			}
		},
		aqa: {
			['markets-and-market-failure']: {
				label: 'Paper 1',
				icon: '/static/images/economics-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1: Markets and Market Failure',
                    num_questions: 14,
                    marks: 80
				}]
			},
			['national-and-international-economy']: {
				label: 'Paper 2',
				icon: '/static/images/economics-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2: National and International Economics',
					num_questions: 14,
					marks: 80
				}]
			},
			['economic-principles-and-issues']: {
				label: 'Paper 3',
				icon: '/static/images/economics-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3: Economic Principles and Issues',
					num_questions: 33,
					marks: 80
				}]
			}
		}
	},
	biology: {
		edexcel: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1: The Natural Environment and Species Survival',
					num_questions: 10,
					marks: 100
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2: Energy, Exercise and Coordination',
					num_questions: 10,
					marks: 100
				}]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3: General and Practical Applications in Biology',
					num_questions: 8,
					marks: 100
				}]
			}
		},
		ocr: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1: Biological processes',
					num_questions: 21,
                    marks: 100
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2: Biological diversity',
					num_questions: 21,
					marks: 100
				}]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3: Unified biology',
					num_questions: 5,
					marks: 70
				}]
			}
		},
		aqa: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1',
					num_questions: 10,
					marks: 91
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2',
					num_questions: 10,
					marks: 91
				}]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/biology-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3',
					num_questions: 7,
					marks: 78
				}]
			}
		}
	},
	chemistry: {
		edexcel: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-1',
                    name: 'Paper 1: Advanced Inorganic and Physical Chemistry',
					num_questions: 9,
					marks: 90
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2: Advanced Organic and Physical Chemistry',
					num_questions: 12,
					marks: 90
				}]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3: General and Practical Principles in Chemistry',
					num_questions: 9,
					marks: 120
				}]
			}
		},
		aqa: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1: Advanced Inorganic and Physical Chemistry',
					num_questions: 11,
					marks: 105
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2: Advanced Organic and Physical Chemistry',
					num_questions: 10,
					marks: 105
				}]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3',
					num_questions: 6,
					marks: 90
				}]
			}
		},
		ocr: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1: Periodic table, elements and physical chemistry',
					num_questions: 22,
					marks: 100
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2: Synthesis and analytical techniques',
					num_questions: 21,
					marks: 100
				}]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/chemistry-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3: Unified chemistry',
					num_questions: 5,
					marks: 70
				}]
			}
		}
	},
	physics: {
		aqa: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-1',
                    name: 'Paper 1',
                    num_questions: 30,
					marks: 85
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2',
					num_questions: 31,
					marks: 85
				}]
			},
			paper_3A: {
				label: 'Paper 3A',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-3A',
					name: 'Paper 3A',
					num_questions: 30,
					marks: 85
				}]
			},
			paper_3B: {
				label: 'Paper 3B',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-3B',
					name: 'Paper 3B Option A (Astrophysics)',
					num_questions: 3,
					marks: 45
				}, {
					href: 'paper-3B',
					name: 'Paper 3 Option B (Medical Physics)',
					num_questions: 5,
					marks: 35
				}, {
					href: 'paper-3B',
					name: 'Paper 3 Option C (Engineering Physics)',
					num_questions: 5,
					marks: 35
				}, {
					href: 'paper-3B',
					name: 'Paper 3 Option D (Turing Points in Physics)',
					num_questions: 4,
					marks: 35
				}, {
					href: 'paper-3B',
					name: 'Paper 3 Option E (Electronics)',
					num_questions: 5,
					marks: 35
				}]
			}
		},
		ocr: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1',
					num_questions: 24,
					marks: 100
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2',
					num_questions: 25,
					marks: 100
				}]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3',
					num_questions: 6,
					marks: 70
				}]
			}
		},
		edexcel: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1',
					num_questions: 17,
					marks: 90
				}]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2',
					num_questions: 20,
					marks: 90
				}]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/physics-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3',
					num_questions: 13,
					marks: 120
				}]
			}
		}
	},
	psychology: {
		edexcel: {
			['foundations-in-psychology']: {
				label: 'Unit 1',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Unit 1: Foundations in Psychology',
                    num_questions: 13,
					marks: 90
				}]
			},
			['applications-of-psychology']: {
				label: 'Unit 2',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Unit 2: Applications of Psychology',
					num_questions: 18,
					marks: 90
				}]
			},
			['psychological-skills']: {
				label: 'Unit 3',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Unit 3: Psychological Skills',
					num_questions: 6,
					marks: 80
				}]
			}
		},
		aqa: {
			['introductory-topics-in-psychology']: {
				label: 'Paper 1',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Paper 1: Introductory Topics in Psychology',
					num_questions: 18,
                    marks: 96
				}]
			},
			['psychology-in-context']: {
				label: 'Paper 2',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Paper 2: Psychology in Context',
					num_questions: 25,
                    marks: 96
				}]
			},
			['issues-and-options-in-psychology']: {
				label: 'Paper 3',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Paper 3: Issues and options in Psychology',
					num_questions: 39,
                    marks: 96
				}]
			}
		},
		ocr: {
			['research-methods']: {
				label: 'Paper 1',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-1',
					name: 'Research Methods',
					num_questions: 31,
					marks: 90
				}]
			},
			['psychological-themes']: {
				label: 'Paper 2',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-2',
					name: 'Psychological themes through Core Studies ',
					num_questions: 12,
					marks: 105
				}]
			},
			['applied-psychology']: {
				label: 'Paper 3',
				icon: '/static/images/psychology-icon.svg',
				papers: [{
					href: 'paper-3',
					name: 'Applied Psychology',
					num_questions: 8,
					marks: 105
				}]
			}
		}
	}
};

export const SUBJECT_STRIPE_IDS = {
	maths: {
		edexcel: 'price_1MwPn1JOIoW2WbjcxUfvTXK8',
		aqa: 'price_1Mw3w7JOIoW2WbjcdaoC1OhI',
		ocr: 'price_1MwPneJOIoW2WbjcMeKhILIE'
	},
	physics: {
		edexcel: 'price_1MwPhXJOIoW2WbjcTzW1nSve',
		aqa: 'price_1MwPgdJOIoW2Wbjc3nX7RBfi',
		ocr: 'price_1MwPgvJOIoW2Wbjcu1cXvuOx'
	},
	chemistry: {
		aqa: 'price_1MwPj2JOIoW2WbjcIFNBJDFH',
		edexcel: 'price_1MwPkTJOIoW2WbjcFTKw2yV8',
		ocr: 'price_1Mw3yAJOIoW2Wbjcpqj3TX3t'
	},
	biology: {
		aqa: 'price_1MwPpSJOIoW2WbjcyDaUyhst',
		edexcel: 'price_1MwPp2JOIoW2Wbjczl6fmsn8',
		ocr: 'price_1Mw3u1JOIoW2WbjcCinfxGiN'
	},
	economics: {
		aqa: 'price_1MwPsmJOIoW2WbjchvRGzqbk',
		edexcel: 'price_1MwPqrJOIoW2WbjcIgj6Xost',
		ocr: 'price_1Mw44nJOIoW2WbjcO6diAxi5'
	},
	psychology: {
		edexcel: 'price_1MwQ0XJOIoW2WbjceLcjAeMQ',
		aqa: 'price_1Mw42jJOIoW2WbjcQkXcvRi0',
		ocr: 'price_1MwQ1WJOIoW2WbjcEVA5vuyv'
	}
};

export const PAPER_PRICE_IDS = {
	maths: 'price_1MvNNdJOIoW2WbjczSvv3fBH',
	biology: 'price_1MvNOjJOIoW2WbjcbYDUUaOB',
	physics: 'price_1MvO29JOIoW2WbjcNntTUGiK',
	chemistry: 'price_1MvO1OJOIoW2WbjcMeRew6KK',
	economics: 'price_1MvfMiJOIoW2WbjcGygjhICM',
	psychology: 'price_1MvfNLJOIoW2Wbjc5Y7iJV3p'
};

export enum CHECKOUT_TYPE {
	COURSE = 'course',
	PAPER = 'paper'
}
