import type { ExamBoard, ExamLevel, Subject } from '@exam-genius/shared/prisma';
import type { AppPrismaClient } from '~/server/prisma';
import type { Logger } from 'next-axiom';
import { genCourseOrPaperName, genID } from '~/utils/functions';
import { ClerkEvent } from '../../utils/types';
import { normalizeExamLevelInput } from '~/utils/exam-level';
import { assertAsLevelExamFlowAllowedPlain } from '~/server/exam-level-guard';
import type { Stripe } from 'stripe/cjs/stripe.core';

const VALID_SUBJECTS = new Set<Subject>(['maths', 'physics', 'chemistry', 'biology', 'economics', 'psychology']);
const VALID_EXAM_BOARDS = new Set<ExamBoard>(['aqa', 'ocr', 'edexcel']);

const getNormalizedOnboardingMetadata = (event: ClerkEvent) => {
	const rawSubject = event.data.unsafe_metadata?.onboarding_subject;
	const rawExamBoard = event.data.unsafe_metadata?.onboarding_exam_board;
	const rawExamLevel = event.data.unsafe_metadata?.onboarding_exam_level;

	if (typeof rawSubject !== 'string' || typeof rawExamBoard !== 'string') {
		return null;
	}

	const subject = rawSubject.toLowerCase().trim() as Subject;
	const examBoard = rawExamBoard.toLowerCase().trim() as ExamBoard;

	if (!VALID_SUBJECTS.has(subject) || !VALID_EXAM_BOARDS.has(examBoard)) {
		return null;
	}

	const examLevel: ExamLevel =
		typeof rawExamLevel === 'string' ? normalizeExamLevelInput(rawExamLevel) : 'a_level';

	return { subject, examBoard, examLevel };
};

export const createNewUser = async ({
	event,
	prisma,
	log
}: {
	event: ClerkEvent;
	prisma: AppPrismaClient;
	log: Logger;
}) => {
	try {
		const payload = event.data;
		const onboardingSelection = getNormalizedOnboardingMetadata(event);
		const user = await prisma.user.create({
			data: {
				clerk_id: event.data.id,
				email: payload.email_addresses[0].email_address,
				full_name: `${payload.first_name} ${payload.last_name}`,
				firstname: payload.first_name,
				lastname: payload.last_name
			}
		});

		if (onboardingSelection) {
			const existingCourse = await prisma.course.findFirst({
				where: {
					user_id: user.clerk_id,
					subject: onboardingSelection.subject,
					exam_board: onboardingSelection.examBoard,
					exam_level: onboardingSelection.examLevel
				}
			});

			if (existingCourse) {
				log.info('Onboarding course already exists for new user', {
					user_id: user.clerk_id,
					subject: onboardingSelection.subject,
					exam_board: onboardingSelection.examBoard,
					exam_level: onboardingSelection.examLevel
				});
			} else {
				assertAsLevelExamFlowAllowedPlain(onboardingSelection.examLevel);
				const yearLevel = onboardingSelection.examLevel === 'as_level' ? 12 : 13;
				const course = await prisma.course.create({
					data: {
						course_id: genID('course'),
						name: genCourseOrPaperName(
							onboardingSelection.subject,
							onboardingSelection.examBoard,
							null,
							onboardingSelection.examLevel
						),
						subject: onboardingSelection.subject,
						exam_board: onboardingSelection.examBoard,
						exam_level: onboardingSelection.examLevel,
						user_id: user.clerk_id,
						year_level: yearLevel
					}
				});
				log.info('Onboarding course auto-created for new user', {
					user_id: user.clerk_id,
					course_id: course.course_id,
					subject: course.subject,
					exam_board: course.exam_board,
					exam_level: course.exam_level
				});
			}
		}
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
	prisma: AppPrismaClient;
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
	log,
	stripe
}: {
	event: ClerkEvent;
	prisma: AppPrismaClient;
	log: Logger;
	stripe: Stripe;
}) => {
	try {
		const payload = event.data;
		// Delete the user from the DB
		const user = await prisma.user.delete({
			where: {
				clerk_id: payload.id
			}
		});
		if (user) {
			log.info('User deleted', { user });
			// Attempt to delete the Stripe customer, if customer_id exists
			if (user.stripe_customer_id) {
				try {
					await stripe.customers.del(user.stripe_customer_id);
					log.info('Stripe customer deleted', { stripe_customer_id: user.stripe_customer_id });
				} catch (stripeErr) {
					log.error('Failed to delete Stripe customer', { stripe_customer_id: user.stripe_customer_id, error: String(stripeErr) });
				}
			}
		}
		return;
	} catch (err) {
		log.error('Delete user error', { error: String(err) });
		throw err;
	}
};
