import { createTRPCRouter } from '../trpc';
import authRouter from './auth';
import stripeRouter from './stripe';
import userRouter from './user';
import courseRouter from './course';

export const appRouter = createTRPCRouter({
	auth: authRouter,
	user: userRouter,
	stripe: stripeRouter,
	course: courseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
