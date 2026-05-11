import { TRPCError } from '@trpc/server';
import { env } from '~/env';
import type { ExamLevel } from '@exam-genius/shared/utils';

function isAsLevelBlocked(examLevel: ExamLevel): boolean {
	return examLevel === 'as_level' && env.DISABLE_AS_LEVEL_EXAM_FLOW === 'true';
}

/** Use from tRPC procedures — returns 403-shaped TRPC error. */
export function assertAsLevelExamFlowAllowed(examLevel: ExamLevel): void {
	if (isAsLevelBlocked(examLevel)) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'AS-level is temporarily unavailable.'
		});
	}
}

/** Use from webhooks / non-tRPC server code. */
export function assertAsLevelExamFlowAllowedPlain(examLevel: ExamLevel): void {
	if (isAsLevelBlocked(examLevel)) {
		throw new Error('AS-level flows are disabled');
	}
}
