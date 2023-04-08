import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { hashPassword } from '../../utils/functions';
import { log } from 'next-axiom'

const authRouter = router({
	clerk: publicProcedure.input(Object).mutation(async ({ input, ctx }) => {
		try {
			console.log('-----------------------------------------------');
			console.log(input)
			log.info('clerk webhook', { customerId: 32423, auth: 'session' })
			log.info(input)
			console.log('-----------------------------------------------');
			return { message: "Success" };
		} catch (err) {
			console.error(err);
			throw new TRPCError({code: "UNPROCESSABLE_CONTENT", message: err.message});
		}
	})
});

export default authRouter;
