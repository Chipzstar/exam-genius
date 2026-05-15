import { z } from 'zod';
import { AttemptModelSchema } from '@exam-genius/shared/prisma-zod/variants/pure/Attempt.pure';
import { AttemptAnswerModelSchema } from '@exam-genius/shared/prisma-zod/variants/pure/AttemptAnswer.pure';

/** Matches `attempt.getLatestForPaper` Prisma query (`include: { answers: true }`). */
const attemptWithAnswersRowSchema = AttemptModelSchema.omit({
	paper: true,
	user: true,
	answers: true
}).extend({
	answers: z.array(AttemptAnswerModelSchema.omit({ attempt: true }))
});

export const getLatestForPaperOutputSchema = attemptWithAnswersRowSchema.nullable();

export type GetLatestForPaperResult = z.infer<typeof getLatestForPaperOutputSchema>;
