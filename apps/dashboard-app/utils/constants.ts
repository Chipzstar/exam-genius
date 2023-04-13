import { PhoneNumberUtil } from 'google-libphonenumber';
import * as process from 'process';
import { CourseInfo, ExamBoard, Subject } from './types';

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

export const SUBJECT_PAPERS: Record<
	Subject,
	Record<
		ExamBoard,
		Record<
			string,
			CourseInfo
		>
	>
> = {
	maths: {
		edexcel: {
			['pure-maths']: {
				label: 'Pure Maths',
				icon: '/static/images/pure-maths-icon.svg',
				modules: ['PM1', 'PM2']
			},
			stats: {
				label: 'Statistics & Mechanics',
				icon: '/static/images/statistics-icon.svg',
				modules: ['Statistics & Mechanics']
			}
		},
		aqa: {
			['pure-maths']: {
				label: 'Pure Maths',
				icon: '/static/images/pure-maths-icon.svg',
				modules: ['PM1', 'PM2']
			},
			stats: {
				label: 'Statistics & Mechanics',
				icon: '/static/images/statistics-icon.svg',
				modules: ['Statistics & Mechanics']
			}
		},
		ocr: {
			['pure-maths']: {
				label: 'Pure Maths',
				icon: '/static/images/pure-maths-icon.svg',
				modules: ['PM1', 'PM2']
			},
			stats: {
				label: 'Statistics & Mechanics',
				icon: '/static/images/statistics-icon.svg',
				modules: ['Statistics & Mechanics']
			}
		}
	},
	economics: {
		edexcel: {
			microeconomics: {
				label: 'Paper 1',
				icon: '/static/images/microeconomics-icon.svg',
				modules: ['Microeconomics']
			},
			macroeconomics: {
				label: 'Paper 2',
				icon: '/static/images/macroeconomics-icon.svg',
				modules: ['Macroeconomics']
			},
			themes: {
				label: 'Paper 3',
				icon: '/static/images/economics-themes-icon.svg',
				modules: ['Themes in Economics']
			}
		},
		ocr: {
			microeconomics: {
				label: 'Paper 1',
				icon: '/static/images/microeconomics-icon.svg',
				modules: ['Microeconomics']
			},
			macroeconomics: {
				label: 'Paper 2',
				icon: '/static/images/macroeconomics-icon.svg',
				modules: ['Macroeconomics']
			},
			themes: {
				label: 'Paper 3',
				icon: '/static/images/economics-themes-icon.svg',
				modules: ['Themes in Economics']
			}
		},
		aqa: {
			microeconomics: {
				label: 'Paper 1',
				icon: '/static/images/microeconomics-icon.svg',
				modules: ['Microeconomics']
			},
			macroeconomics: {
				label: 'Paper 2',
				icon: '/static/images/macroeconomics-icon.svg',
				modules: ['Macroeconomics']
			},
			themes: {
				label: 'Paper 3',
				icon: '/static/images/economics-themes-icon.svg',
				modules: ['Themes in Economics']
			}
		}
	},
	biology: {
		aqa: {
			paper_1: {
				label: 'Paper 1',
                icon: '/static/images/biology-icon.svg',
                modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
                icon: '/static/images/biology-icon.svg',
                modules: ['Paper 2']
			},
			paper_3: {
                label: 'Paper 3',
                icon: '/static/images/biology-icon.svg',
                modules: ['Paper 3']
            }
		},
		ocr: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/biology-icon.svg',
				modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/biology-icon.svg',
				modules: ['Paper 2']
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/biology-icon.svg',
				modules: ['Paper 3']
			}
		},
		edexcel: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/biology-icon.svg',
				modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/biology-icon.svg',
				modules: ['Paper 2']
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/biology-icon.svg',
				modules: ['Paper 3']
			}
		}
	},
	chemistry: {
		edexcel: {
			paper_1: {
				label: 'Paper 1',
                icon: '/static/images/chemistry-icon.svg',
                modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
                icon: '/static/images/chemistry-icon.svg',
                modules: ['Paper 2']
			},
			paper_3: {
				label: 'Paper 3',
                icon: '/static/images/chemistry-icon.svg',
                modules: ['Paper 3']
			}
		},
		aqa: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/chemistry-icon.svg',
				modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/chemistry-icon.svg',
				modules: ['Paper 2']
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/chemistry-icon.svg',
				modules: ['Paper 3']
			}
		},
		ocr: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/chemistry-icon.svg',
				modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/chemistry-icon.svg',
				modules: ['Paper 2']
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/chemistry-icon.svg',
				modules: ['Paper 3']
			}
		}
	},
	physics: {
		aqa: {
			paper_1: {
				label: 'Paper 1',
                icon: '/static/images/physics-icon.svg',
				modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
                icon: '/static/images/physics-icon.svg',
                modules: ['Paper 2']
			},
			paper_3: {
				label: 'Paper 3',
                icon: '/static/images/physics-icon.svg',
                modules: ['Paper 3']
			}
		},
		ocr: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/physics-icon.svg',
				modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/physics-icon.svg',
				modules: ['Paper 2']
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/physics-icon.svg',
				modules: ['Paper 3']
			}
		},
		edexcel: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/physics-icon.svg',
				modules: ['Paper 1']
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/physics-icon.svg',
				modules: ['Paper 2']
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/physics-icon.svg',
				modules: ['Paper 3']
			}
		}
	},
	psychology: {
		edexcel: {
			paper_1: {
				label: 'Paper 1',
                icon: '/static/images/psychology-icon.svg',
                modules: ['Introductory Topics in Psychology']
			},
			paper_2: {
				label: 'Paper 2',
                icon: '/static/images/psychology-icon.svg',
				modules: ['Psychology in Context']
			}
		},
		aqa: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/psychology-icon.svg',
				modules: ['Introductory Topics in Psychology']
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/psychology-icon.svg',
				modules: ['Psychology in Context']
			}
		},
		ocr: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/psychology-icon.svg',
				modules: ['Introductory Topics in Psychology']
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/psychology-icon.svg',
				modules: ['Psychology in Context']
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
	physics: 'price_1MvNQdJOIoW2WbjczSvv3fBH',
	chemistry: 'price_1MvNQdJOIoW2WbjczSvv3fBH',
	biology: 'price_1MvNQdJOIoW2WbjczSvv3fBH',
	economics: 'price_1MvNQdJOIoW2WbjczSvv3fBH',
	psychology: 'price_1MvNQdJOIoW2WbjczSvv3fBH'
};

// export type PRICE_ID = SUBJECT_PRICE_IDS[keyof SUBJECT_PRICE_IDS]
