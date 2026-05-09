import type { ExamLevel } from '@exam-genius/shared/utils';

/** Normalize Stripe / Clerk / URL fragments into Prisma `ExamLevel`. */
export function normalizeExamLevelInput(raw: string | null | undefined): ExamLevel {
	if (!raw || typeof raw !== 'string') return 'a_level';
	const l = raw.toLowerCase().trim();
	if (l === 'as_level' || l === 'as-level' || l === 'aslevel') return 'as_level';
	return 'a_level';
}
