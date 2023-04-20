export type Subject = 'maths' | 'biology' | 'chemistry' | 'physics' | 'economics' | 'psychology';
export type ExamBoard = 'edexcel' | 'aqa' | 'ocr';

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
