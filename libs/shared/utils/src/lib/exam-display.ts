import type { ExamBoard, ExamLevel } from './shared-types';

/** User-facing exam qualification tier (e.g. course picker, labels). */
export function formatExamLevelForDisplay(level: ExamLevel): string {
	return level === 'as_level' ? 'AS Level' : 'A Level';
}

/** User-facing exam board name (AQA, OCR, Edexcel). */
export function formatExamBoardForDisplay(board: ExamBoard): string {
	switch (board) {
		case 'aqa':
		case 'ocr':
			return board.toUpperCase();
		case 'edexcel':
			return board.charAt(0).toUpperCase() + board.slice(1).toLowerCase();
	}
}
