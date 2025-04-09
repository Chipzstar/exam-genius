import type { PrismaClient } from '@prisma/client';
import { ClerkEvent } from '../../utils/types';
import { log } from '~/server/logtail';

export const createNewUser = async ({ event, prisma }: { event: ClerkEvent; prisma: PrismaClient }) => {
	try {
		const payload = event.data;
		// create the user
		const user = await prisma.user.create({
			data: {
				clerk_id: event.data.id,
				email: payload.email_addresses[0].email_address,
				full_name: `${payload.first_name} ${payload.last_name}`,
				firstname: payload.first_name,
				lastname: payload.last_name
			}
		});
		log.info('-----------------------------------------------');
		log.debug('New user!!', user);
		log.info('-----------------------------------------------');
		return user;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const updateUser = async ({ event, prisma }: { event: ClerkEvent; prisma: PrismaClient }) => {
	try {
		const payload = event.data;
		// create the user
		const user = await prisma.user.update({
			where: {
				clerk_id: event.data.id
			},
			data: {
				email: payload.email_addresses[0].email_address,
				full_name: `${payload.first_name} ${payload.last_name}`,
				firstname: payload.first_name,
				lastname: payload.last_name
			}
		});
		log.info('-----------------------------------------------');
		log.debug('Updated user!!', user);
		log.info('-----------------------------------------------');
		return user;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const deleteUser = async ({ event, prisma }: { event: ClerkEvent; prisma: PrismaClient }) => {
	try {
		const payload = event.data;
		const user = await prisma.user.delete({
			where: {
				clerk_id: payload.id
			}
		});
		if (user) {
			log.info('-----------------------------------------------');
			log.debug('User deleted!!', user);
			log.info('-----------------------------------------------');
		}
		return;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
