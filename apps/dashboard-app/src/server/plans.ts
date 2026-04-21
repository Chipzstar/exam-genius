export type UserPlanKey = 'free' | 'plus' | 'pro';

export type RateLimitFeature =
	| 'paper_generate'
	| 'question_edit'
	| 'reference_upload'
	| 'attempt_submit'
	| 'rating_submit';

export type Limit = { unlimited: true } | { points: number; window: '1 s' | '1 m' | '1 h' | '1 d' };

/** All tiers unlimited for now; tighten when launching paid caps. */
export const PLAN_LIMITS: Record<UserPlanKey, Record<RateLimitFeature, Limit>> = {
	free: {
		paper_generate: { unlimited: true },
		question_edit: { unlimited: true },
		reference_upload: { unlimited: true },
		attempt_submit: { unlimited: true },
		rating_submit: { unlimited: true }
	},
	plus: {
		paper_generate: { unlimited: true },
		question_edit: { unlimited: true },
		reference_upload: { unlimited: true },
		attempt_submit: { unlimited: true },
		rating_submit: { unlimited: true }
	},
	pro: {
		paper_generate: { unlimited: true },
		question_edit: { unlimited: true },
		reference_upload: { unlimited: true },
		attempt_submit: { unlimited: true },
		rating_submit: { unlimited: true }
	}
};
