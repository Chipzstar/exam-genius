import type { PrismaClient } from '@prisma/client';
import { ClerkEvent } from '../../utils/types';
import { log } from 'next-axiom';
import { v4 as uuidv4 } from 'uuid';

export const createNewUser = async ({ event, prisma }: { event: ClerkEvent; prisma: PrismaClient }) => {
	try {
		const payload = event.data;
		// create the user
		const user = await prisma.user.create({
			data: {
				clerkId: uuidv4(),
				clerk_id: event.data.id,
				email: payload.email_addresses[0].email_address,
				full_name: `${payload.first_name} ${payload.last_name}`,
				firstname: payload.first_name,
				lastname: payload.last_name
			}
		});
		console.log('-----------------------------------------------');
		log.debug('New user!!', user);
		console.log('-----------------------------------------------');
		return user;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const deleteUser = async ({ event, prisma }: { event: ClerkEvent; prisma: PrismaClient})=> {
	try {
	    const payload = event.data;
		const user = await prisma.user.delete({
            where: {
                clerk_id: payload.id
            }
        });
		console.log('-----------------------------------------------');
		log.debug('User deleted!!', user);
		console.log('-----------------------------------------------');
		return;
	} catch (err) {
	    console.error(err)
		throw err;
	}
}
