import type { PrismaClient } from '@exam-genius/shared/prisma';
import type { Logger } from 'next-axiom';
import { ClerkEvent } from '../../utils/types';

export const createNewUser = async ({
	event,
	prisma,
	log
}: {
	event: ClerkEvent;
	prisma: PrismaClient;
	log: Logger;
}) => {
	try {
		const payload = event.data;
		const user = await prisma.user.create({
			data: {
				clerk_id: event.data.id,
				email: payload.email_addresses[0].email_address,
				full_name: `${payload.first_name} ${payload.last_name}`,
				firstname: payload.first_name,
				lastname: payload.last_name
			}
		});
		log.info('New user created', { user });
		return user;
	} catch (err) {
		log.error('Create user error', { error: String(err) });
		throw err;
	}
};

export const updateUser = async ({
	event,
	prisma,
	log
}: {
	event: ClerkEvent;
	prisma: PrismaClient;
	log: Logger;
}) => {
	try {
		const payload = event.data;
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
		log.info('User updated', { user });
		return user;
	} catch (err) {
		log.error('Update user error', { error: String(err) });
		throw err;
	}
};

export const deleteUser = async ({
	event,
	prisma,
	log
}: {
	event: ClerkEvent;
	prisma: PrismaClient;
	log: Logger;
}) => {
	try {
		const payload = event.data;
		const user = await prisma.user.delete({
			where: {
				clerk_id: payload.id
			}
		});
		if (user) {
			log.info('User deleted', { user });
		}
		return;
	} catch (err) {
		log.error('Delete user error', { error: String(err) });
		throw err;
	}
};
