import type { CourseInfo, ExamBoard, ExamLevel, Subject } from './shared-types';
import aLevelSubjectPapers from './a-level-subject-papers.json';
import asLevelSubjectPapers from './as-level-subject-papers.json';

/** Nested catalog: subject → exam board → unit slug → unit metadata + papers */
export type SubjectPapersCatalog = Record<Subject, Record<ExamBoard, Record<string, CourseInfo>>>;

export const SUBJECT_PAPERS_A_LEVEL = aLevelSubjectPapers as SubjectPapersCatalog;

export const SUBJECT_PAPERS_AS_LEVEL = asLevelSubjectPapers as SubjectPapersCatalog;

export const SUBJECT_PAPERS_BY_LEVEL: Record<ExamLevel, SubjectPapersCatalog> = {
	a_level: SUBJECT_PAPERS_A_LEVEL,
	as_level: SUBJECT_PAPERS_AS_LEVEL
};

export function getSubjectPapersCatalog(level: ExamLevel): SubjectPapersCatalog {
	return SUBJECT_PAPERS_BY_LEVEL[level];
}

/**
 * Legacy export: A-level catalog only (existing behaviour before dual-level support).
 * Prefer {@link getSubjectPapersCatalog} when course exam level is known.
 */
export const SUBJECT_PAPERS = SUBJECT_PAPERS_A_LEVEL;
