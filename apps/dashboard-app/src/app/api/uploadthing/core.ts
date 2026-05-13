import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { genID } from '~/utils/functions';
import { backendApi } from '~/server/backend-headers';
import { prisma } from '~/server/prisma';
import { referencesListTag, questionsForPaperListTag } from '~/server/accelerate-cache-tags';

const f = createUploadthing();

export const ourFileRouter = {
	paperReference: f({
		pdf: { maxFileSize: '16MB', maxFileCount: 1 }
	})
		.input(
			z.object({
				courseId: z.string(),
				paperCode: z.string().optional(),
				kind: z.enum(['question_paper', 'mark_scheme', 'examiner_report'])
			})
		)
		.middleware(async ({ input }) => {
			const { userId } = await auth();
			if (!userId) throw new UploadThingError('Unauthorized');
			const referenceId = genID('ref');
			return { userId, referenceId, ...input };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			try {
				await backendApi.post('/server/references/extract', {
					reference_id: metadata.referenceId,
					user_id: metadata.userId,
					course_id: metadata.courseId,
					paper_code: metadata.paperCode ?? null,
					kind: metadata.kind,
					ut_key: file.key,
					ut_url: file.ufsUrl,
					filename: file.name
				});
				await prisma.$accelerate.invalidate({
					tags: [
						referencesListTag(metadata.userId),
						referencesListTag(metadata.userId, metadata.courseId)
					]
				});
			} catch (e) {
				console.error('[uploadthing] extract callback', e);
			}
			return { referenceId: metadata.referenceId };
		}),

	figureReplace: f({
		image: { maxFileSize: '8MB', maxFileCount: 1 }
	})
		.input(
			z.object({
				paperId: z.string(),
				questionId: z.string(),
				blockIndex: z.coerce.number().int().min(0)
			})
		)
		.middleware(async ({ input }) => {
			const { userId } = await auth();
			if (!userId) throw new UploadThingError('Unauthorized');

			const owns = await prisma.question.findFirst({
				where: {
					question_id: input.questionId,
					paper: { paper_id: input.paperId, user_id: userId }
				},
				select: { question_id: true }
			});

			if (!owns) throw new UploadThingError('Forbidden');

			return {
				userId,
				paperId: input.paperId,
				questionId: input.questionId,
				blockIndex: input.blockIndex
			};
		})
		.onUploadComplete(async ({ metadata, file }) => {
			try {
				await backendApi.post('/server/paper/replace-figure', {
					question_id: metadata.questionId,
					block_index: metadata.blockIndex,
					image_url: file.ufsUrl
				});
				await prisma.$accelerate.invalidate({
					tags: [questionsForPaperListTag(metadata.paperId)]
				});
			} catch (e) {
				console.error('[uploadthing] figureReplace', e);
			}
			return { ok: true as const };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
