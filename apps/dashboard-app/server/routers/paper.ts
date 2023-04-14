import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const paperRouter = createTRPCRouter({
	getPapers: protectedProcedure.query(async ({ ctx }) => {
		try {
			const user_id = ctx.auth.userId;
			const papers = await ctx.prisma.paper.findMany({
				where: {
					user_id
				}
			});
			console.log('-----------------------------------------------');
			console.log(papers);
			return papers;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Oops, something went wrong' + err.message });
		}
	}),
	getSinglePaper: protectedProcedure
		.input(
			z.object({
				paperId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			try {
				const paper = await ctx.prisma.paper.findFirstOrThrow({
					where: {
						user_id: ctx.auth.userId,
						paper_id: input.paperId
					}
				});
				console.log(paper);
				console.log('-----------------------------------------------');
				return paper;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + err.message
				});
			}
		})
});

export default paperRouter;
