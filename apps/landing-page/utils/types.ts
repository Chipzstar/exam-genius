import { CourseInfo, ExamBoard, Subject } from '@exam-genius/shared/utils';

export interface FormValues {
	subject: Subject | string;
	examBoard: ExamBoard | string;
	course: [string, CourseInfo][];
	paper: string;
	sneak_peak_questions: { question: string; answer: string; chance: number }[];
}
