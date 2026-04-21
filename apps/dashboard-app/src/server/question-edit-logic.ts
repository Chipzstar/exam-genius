import { z } from 'zod';
import type { PrismaClient } from '@exam-genius/shared/prisma';
import { TRPCError } from '@trpc/server';

export const blockSchema = z.discriminatedUnion('kind', [
	z.object({ kind: z.literal('text'), value: z.string() }),
	z.object({ kind: z.literal('math'), value: z.string() }),
	z.object({
		kind: z.literal('table'),
		headers: z.array(z.string()),
		rows: z.array(z.array(z.string()))
	}),
	z.object({ kind: z.literal('image_placeholder'), caption: z.string() })
]);

export const editOutputSchema = z.object({
	body: z.array(blockSchema),
	marks: z.number().optional()
});

export type QuestionForEdit = {
	question_id: string;
	revision: number;
	marks: number;
	body: unknown;
	paper: { user_id: string };
};

export function buildQuestionEditPrompt(
	q: Pick<QuestionForEdit, 'body' | 'marks'>,
	input: { userPrompt: string; preset?: string | null; preserveMarks: boolean }
): string {
	const presetLine = input.preset ? `Preset: ${input.preset}. ` : '';
	const marksLine = input.preserveMarks
		? `Keep total marks at ${q.marks}.`
		: `You may adjust marks; return "marks" in JSON.`;
	return (
		`${presetLine}${marksLine} Student request: ${input.userPrompt}\n\n` +
		`Current question body (JSON blocks): ${JSON.stringify(q.body)}\n\n` +
		`Return ONLY valid JSON: {"body":[...blocks...],"marks": optional number}. ` +
		`Blocks use kind: text|math|table|image_placeholder with the same shape as input.`
	);
}

export function parseEditModelText(text: string): z.infer<typeof editOutputSchema> {
	const cleaned = text.replace(/^```json\s*|\s*```$/g, '').trim();
	return editOutputSchema.parse(JSON.parse(cleaned));
}

export async function persistQuestionEditFromParsed(
	prisma: PrismaClient,
	q: QuestionForEdit,
	parsed: z.infer<typeof editOutputSchema>,
	preserveMarks: boolean
) {
	const nextMarks = preserveMarks ? q.marks : (parsed.marks ?? q.marks);

	await prisma.questionRevision.create({
		data: {
			question_id: q.question_id,
			revision: q.revision,
			body: q.body as object[],
			marks: q.marks
		}
	});

	return prisma.question.update({
		where: { question_id: q.question_id },
		data: {
			body: parsed.body as object[],
			marks: nextMarks,
			revision: { increment: 1 }
		}
	});
}

export async function loadQuestionForEdit(
	prisma: PrismaClient,
	questionId: string,
	userId: string
): Promise<QuestionForEdit> {
	const q = await prisma.question.findFirst({
		where: {
			question_id: questionId,
			paper: { user_id: userId }
		},
		include: { paper: true }
	});
	if (!q) throw new TRPCError({ code: 'NOT_FOUND', message: 'Question not found' });
	return {
		question_id: q.question_id,
		revision: q.revision,
		marks: q.marks,
		body: q.body,
		paper: { user_id: q.paper.user_id }
	};
}
