import { EXAM_BOARDS, EXAM_LEVELS, SUBJECTS } from '@exam-genius/shared/utils';
import { z } from 'zod';

export const examBoardSchema = z.enum(EXAM_BOARDS);
export const subjectSchema = z.enum(SUBJECTS);
export const examLevelSchema = z.enum(EXAM_LEVELS);
