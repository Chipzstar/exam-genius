import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { genID } from '~/utils/functions';
import { backendApi } from '~/server/backend-headers';

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
			} catch (e) {
				console.error('[uploadthing] extract callback', e);
			}
			return { referenceId: metadata.referenceId };
		})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
