import 'server-only';

import type { Subject } from '@exam-genius/shared/utils';
import { env } from '~/env';

export const SUBJECT_STRIPE_IDS = {
	maths: {
		edexcel: String(env.EDEXCEL_MATHS_COURSE_PRICE_ID),
		aqa: String(env.AQA_MATHS_COURSE_PRICE_ID),
		ocr: String(env.OCR_MATHS_COURSE_PRICE_ID)
	},
	physics: {
		edexcel: String(env.EDEXCEL_PHYSICS_COURSE_PRICE_ID),
		aqa: String(env.AQA_PHYSICS_COURSE_PRICE_ID),
		ocr: String(env.OCR_PHYSICS_COURSE_PRICE_ID)
	},
	chemistry: {
		edexcel: String(env.EDEXCEL_CHEMISTRY_COURSE_PRICE_ID),
		aqa: String(env.AQA_CHEMISTRY_COURSE_PRICE_ID),
		ocr: String(env.OCR_CHEMISTRY_COURSE_PRICE_ID)
	},
	biology: {
		edexcel: String(env.EDEXCEL_BIOLOGY_COURSE_PRICE_ID),
		aqa: String(env.AQA_BIOLOGY_COURSE_PRICE_ID),
		ocr: String(env.OCR_BIOLOGY_COURSE_PRICE_ID)
	},
	economics: {
		edexcel: String(env.EDEXCEL_ECONOMICS_COURSE_PRICE_ID),
		aqa: String(env.AQA_ECONOMICS_COURSE_PRICE_ID),
		ocr: String(env.OCR_ECONOMICS_COURSE_PRICE_ID)
	},
	psychology: {
		edexcel: String(env.EDEXCEL_PSYCHOLOGY_COURSE_PRICE_ID),
		aqa: String(env.AQA_PSYCHOLOGY_COURSE_PRICE_ID),
		ocr: String(env.OCR_PSYCHOLOGY_COURSE_PRICE_ID)
	}
} as const;

export const PAPER_PRICE_IDS: Record<Subject, string> = {
	maths: String(env.MATHS_PAPER_PRICE_ID),
	biology: String(env.BIOLOGY_PAPER_PRICE_ID),
	physics: String(env.PHYSICS_PAPER_PRICE_ID),
	chemistry: String(env.CHEMISTRY_PAPER_PRICE_ID),
	economics: String(env.ECONOMICS_PAPER_PRICE_ID),
	psychology: String(env.PSYCHOLOGY_PAPER_PRICE_ID)
};
