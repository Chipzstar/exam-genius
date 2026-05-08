import type { ExamBoard, PrismaClient, Subject } from '@exam-genius/shared/prisma';
import type { Logger } from 'next-axiom';
import { genCourseOrPaperName, genID } from '~/utils/functions';
import { ClerkEvent } from '../../utils/types';

const VALID_SUBJECTS = new Set<Subject>(['maths', 'physics', 'chemistry', 'biology', 'economics', 'psychology']);
const VALID_EXAM_BOARDS = new Set<ExamBoard>(['aqa', 'ocr', 'edexcel']);

const getNormalizedOnboardingMetadata = (event: ClerkEvent) => {
	const rawSubject = event.data.unsafe_metadata?.onboarding_subject;
	const rawExamBoard = event.data.unsafe_metadata?.onboarding_exam_board;

	if (typeof rawSubject !== 'string' || typeof rawExamBoard !== 'string') {
		return null;
	}

	const subject = rawSubject.toLowerCase().trim() as Subject;
	const examBoard = rawExamBoard.toLowerCase().trim() as ExamBoard;

	if (!VALID_SUBJECTS.has(subject) || !VALID_EXAM_BOARDS.has(examBoard)) {
		return null;
	}

	return { subject, examBoard };
};

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
					exam_board: onboardingSelection.examBoard
				}
			});

			if (existingCourse) {
				log.info('Onboarding course already exists for new user', {
					user_id: user.clerk_id,
					subject: onboardingSelection.subject,
					exam_board: onboardingSelection.examBoard
				});
			} else {
				const course = await prisma.course.create({
					data: {
						course_id: genID('course'),
						name: genCourseOrPaperName(onboardingSelection.subject, onboardingSelection.examBoard),
						subject: onboardingSelection.subject,
						exam_board: onboardingSelection.examBoard,
						user_id: user.clerk_id,
						year_level: 13
					}
				});
				log.info('Onboarding course auto-created for new user', {
					user_id: user.clerk_id,
					course_id: course.course_id,
					subject: course.subject,
					exam_board: course.exam_board
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
