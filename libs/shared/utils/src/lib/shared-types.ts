export type Subject = 'maths' | 'biology' | 'chemistry' | 'physics' | 'economics' | 'psychology';
export type ExamBoard = 'edexcel' | 'aqa' | 'ocr' | 'wjec';

/** Qualification tier stored on Course and used for catalog selection / prompts */
export type ExamLevel = 'a_level' | 'as_level';

export const SUBJECTS = ['maths', 'biology', 'chemistry', 'physics', 'economics', 'psychology'] as const satisfies readonly Subject[];

export const EXAM_BOARDS = ['edexcel', 'aqa', 'ocr', 'wjec'] as const satisfies readonly ExamBoard[];

export const EXAM_LEVELS = ['a_level', 'as_level'] as const satisfies readonly ExamLevel[];

export interface PaperInfo {
	href: string;
	code: string;
	name: string;
	num_questions: number;
	marks: number;
}

export type CourseInfo = {
	label: string;
	icon: string;
	papers: PaperInfo[];
};
