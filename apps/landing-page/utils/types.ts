import type { CourseInfo, ExamBoard, ExamLevel, Subject } from '@exam-genius/shared/utils';

export interface FormValues {
	examLevel: ExamLevel | '';
	subject: Subject | string;
	examBoard: ExamBoard | string;
	course: [string, CourseInfo][];
	paper: string;
	sneak_peak_questions: { question: string; answer: string; chance: number }[];
}
