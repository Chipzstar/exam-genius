import { parseAsString, parseAsStringLiteral } from 'nuqs';

/** Matches Prisma `Subject` enum — URL values from onboarding use lowercase. */
export const SIGNUP_SUBJECTS = ['maths', 'physics', 'chemistry', 'biology', 'economics', 'psychology'] as const;

/** Matches Prisma `ExamBoard` enum */
export const SIGNUP_EXAM_BOARDS = ['aqa', 'ocr', 'edexcel'] as const;

/** Matches Prisma `ExamLevel` enum */
export const SIGNUP_EXAM_LEVELS = ['a_level', 'as_level'] as const;

export type SignupSubjectParam = (typeof SIGNUP_SUBJECTS)[number];
export type SignupExamBoardParam = (typeof SIGNUP_EXAM_BOARDS)[number];
export type SignupExamLevelParam = (typeof SIGNUP_EXAM_LEVELS)[number];

/**
 * Parsers for `/signup` marketing and onboarding attribution query params.
 * Invalid enum values resolve to `null` (see nuqs `parseAsStringLiteral`).
 */
export const signupSearchParamsParsers = {
	source: parseAsString.withDefault('direct'),
	phase: parseAsString.withDefault('signup'),
	subject: parseAsStringLiteral(SIGNUP_SUBJECTS),
	examBoard: parseAsStringLiteral(SIGNUP_EXAM_BOARDS),
	examLevel: parseAsStringLiteral(SIGNUP_EXAM_LEVELS),
	paper: parseAsString
} as const;
