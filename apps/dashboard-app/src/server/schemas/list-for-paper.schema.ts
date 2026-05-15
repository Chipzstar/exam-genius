import { z } from 'zod';
import { QuestionModelSchema } from '@exam-genius/shared/prisma-zod/variants/pure/Question.pure';

/** Matches `question.listForPaper` (feedback filtered to current user, `select: { sentiment: true }`). */
const listForPaperRowSchema = QuestionModelSchema.omit({
	paper: true,
	parent: true,
	children: true,
	revisions: true,
	feedback: true
}).extend({
	feedback: z.array(z.object({ sentiment: z.number().int() }).strict())
});

export const listForPaperOutputSchema = z.array(listForPaperRowSchema);

export type ListForPaperRow = z.infer<typeof listForPaperRowSchema>;
