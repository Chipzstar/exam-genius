import { z } from 'zod';
import { ExamLevelSchema } from '@exam-genius/shared/prisma-zod/enums/ExamLevel.schema';
import { PaperModelSchema } from '@exam-genius/shared/prisma-zod/variants/pure/Paper.pure';
import { PaperRatingModelSchema } from '@exam-genius/shared/prisma-zod/variants/pure/PaperRating.pure';

/** Paper row shape returned by `paper.getPapersByCode` (matches Prisma include / course select). */
const paperScalarsForByCode = PaperModelSchema.omit({
	user: true,
	course: true,
	questions: true,
	markScheme: true,
	paperRating: true,
	attempts: true
});

export const getPapersByCodeRowSchema = paperScalarsForByCode.extend({
	paperRating: PaperRatingModelSchema.omit({ paper: true }).nullable(),
	course: z.object({ exam_level: ExamLevelSchema }).strict()
});

export const getPapersByCodeOutputSchema = z.array(getPapersByCodeRowSchema);

export type GetPapersByCodeRow = z.infer<typeof getPapersByCodeRowSchema>;
