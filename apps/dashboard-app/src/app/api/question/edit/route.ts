import { auth } from '@clerk/nextjs/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { env } from '~/env';
import { prisma } from '~/server/prisma';
import {
	buildQuestionEditPrompt,
	loadQuestionForEdit,
	parseEditModelText,
	persistQuestionEditFromParsed,
	QUESTION_EDIT_PROMPT_VERSION
} from '~/server/question-edit-logic';
import { logAiStructured } from '~/server/ai-structured-log';

export const runtime = 'nodejs';
export const maxDuration = 60;

const bodySchema = z.object({
	questionId: z.string(),
	userPrompt: z.string().min(1).max(4000),
	preset: z.string().optional(),
	preserveMarks: z.boolean().default(true)
});

const openaiSdk = createOpenAI({ apiKey: env.OPENAI_API_KEY });

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	let json: unknown;
	try {
		json = await req.json();
	} catch {
		return new Response('Invalid JSON', { status: 400 });
	}

	const parsedBody = bodySchema.safeParse(json);
	if (!parsedBody.success) {
		return new Response('Invalid body', { status: 400 });
	}

	const input = parsedBody.data;

	const t0 = Date.now();
	const modelName = env.OPENAI_QUESTION_EDIT_MODEL ?? 'gpt-4o-mini';

	let q: Awaited<ReturnType<typeof loadQuestionForEdit>>;
	try {
		q = await loadQuestionForEdit(prisma, input.questionId, userId);
	} catch (e) {
		if (e instanceof TRPCError && e.code === 'NOT_FOUND') {
			return new Response('Not found', { status: 404 });
		}
		throw e;
	}

	try {
		const prompt = buildQuestionEditPrompt(q, {
			userPrompt: input.userPrompt,
			preset: input.preset,
			preserveMarks: input.preserveMarks
		});

		const result = streamText({
			model: openaiSdk(modelName),
			prompt,
			onFinish: async ({ text }) => {
				try {
					const parsed = parseEditModelText(text);
					await persistQuestionEditFromParsed(prisma, q, parsed, input.preserveMarks);
					logAiStructured('question_edit', {
						ok: true,
						channel: 'stream',
						question_id: q.question_id,
						paper_id: q.paper.paper_id,
						model: modelName,
						prompt_version: QUESTION_EDIT_PROMPT_VERSION,
						duration_ms: Date.now() - t0
					});
				} catch (e) {
					logAiStructured('question_edit', {
						ok: false,
						channel: 'stream',
						phase: 'persist',
						question_id: q.question_id,
						paper_id: q.paper.paper_id,
						model: modelName,
						prompt_version: QUESTION_EDIT_PROMPT_VERSION,
						duration_ms: Date.now() - t0,
						error: String(e)
					});
					console.error('[api/question/edit] persist failed', e);
				}
			}
		});

		return result.toTextStreamResponse();
	} catch (e) {
		logAiStructured('question_edit', {
			ok: false,
			channel: 'stream',
			phase: 'invoke',
			question_id: q.question_id,
			paper_id: q.paper.paper_id,
			model: modelName,
			prompt_version: QUESTION_EDIT_PROMPT_VERSION,
			duration_ms: Date.now() - t0,
			error: String(e)
		});
		console.error('[api/question/edit]', e);
		return new Response('Failed', { status: 500 });
	}
}
