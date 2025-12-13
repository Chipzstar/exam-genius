import { createTRPCRouter } from '../trpc';
import stripeRouter from './stripe';
import userRouter from './user';
import courseRouter from './course';
import paperRouter from './paper';

export const appRouter = createTRPCRouter({
	user: userRouter,
	stripe: stripeRouter,
	course: courseRouter,
	paper: paperRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
