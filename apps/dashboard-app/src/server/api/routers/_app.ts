import { createTRPCRouter } from '../trpc';
import stripeRouter from './stripe';
import userRouter from './user';
import courseRouter from './course';
import paperRouter from './paper';
import questionRouter from './question';
import ratingRouter from './rating';
import attemptRouter from './attempt';
import referenceRouter from './reference';

export const appRouter = createTRPCRouter({
	user: userRouter,
	stripe: stripeRouter,
	course: courseRouter,
	paper: paperRouter,
	question: questionRouter,
	rating: ratingRouter,
	attempt: attemptRouter,
	reference: referenceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
