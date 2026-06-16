import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import type { ExamBoard, Subject } from '@exam-genius/shared/utils';
import { getSubjectPapersCatalog, SNEAK_PEAK_QUESTION_ANSWERS } from '@exam-genius/shared/utils';
import { FormValues } from '../utils/types';
import {
	trackLandingCtaClick,
	trackSignupCtaClick,
	trackSneakPeakEngagement,
	trackSneakPeakOpened,
	trackSneakPeakStepCompleted
} from '../utils/analytics';
import { useWjecExamBoardFlag } from '../hooks/useWjecExamBoardFlag';
import { SneakPeekFlow } from '../components/sneak-peek/sneak-peek-flow';

const STEP_LABELS = ['subject', 'exam_board', 'paper_selection', 'reveal'] as const;
const REVEAL_STEP_INDEX = 3;
const GENERATION_STEP_INDEX = 2;
const GENERATION_DELAY_MS = 1800;

interface SneakPeakSlideshowProps {
	opened: boolean;
	onClose: () => void;
}

const SneakPeakSlideshow = ({ opened, onClose }: SneakPeakSlideshowProps) => {
	const [active, setActive] = useState(0);
	const [generationTimer, setGenerationTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
	const { enabled: showWjec, ready: wjecFlagReady } = useWjecExamBoardFlag();

	const form = useForm<FormValues>({
		initialValues: {
			subject: '',
			examBoard: '',
			course: [],
			paper: '',
			sneak_peak_questions: []
		}
	});

	useEffect(() => {
		const storedValue = window.localStorage.getItem('form');
		if (!storedValue) return;
		try {
			const parsed = JSON.parse(storedValue) as Partial<FormValues>;
			form.setValues({
				subject: parsed.subject ?? '',
				examBoard: parsed.examBoard ?? '',
				course: parsed.course ?? [],
				paper: parsed.paper ?? '',
				sneak_peak_questions: parsed.sneak_peak_questions ?? []
			});
		} catch (e) {
			console.log('Failed to parse stored value');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot hydrate from localStorage
	}, []);

	useEffect(() => {
		window.localStorage.setItem('form', JSON.stringify(form.values));
	}, [form.values]);

	useEffect(() => {
		if (!opened) return;
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [opened]);

	useEffect(() => {
		if (!opened) return;

		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') handleClose();
		}

		window.addEventListener('keydown', handleEscape);

		return () => window.removeEventListener('keydown', handleEscape);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- close handler intentionally reads current timer/form state
	}, [opened, generationTimer]);

	useEffect(() => {
		return () => {
			if (generationTimer) clearTimeout(generationTimer);
		};
	}, [generationTimer]);

	useEffect(() => {
		if (!wjecFlagReady) return;
		if (!showWjec && form.values.examBoard === 'wjec') {
			form.setFieldValue('examBoard', '');
			form.setFieldValue('course', []);
			form.setFieldValue('paper', '');
		}
	}, [wjecFlagReady, showWjec, form]);

	useEffect(() => {
		const subject = form.values.subject as Subject | '';
		const examBoard = form.values.examBoard as ExamBoard | '';
		if (!subject || !examBoard) return;
		const catalog = getSubjectPapersCatalog('a_level');
		const boardMap = catalog[subject]?.[examBoard];
		if (boardMap) {
			form.setFieldValue('course', Object.entries(boardMap));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- derived catalog refresh only when selections change
	}, [form.values.subject, form.values.examBoard]);

	useEffect(() => {
		if (!opened) return;

		trackSneakPeakOpened('sneak-peak-modal');
	}, [opened]);

	const signupUrl = useMemo(() => {
		const signupParams = new URLSearchParams({
			source: 'landing',
			phase: 'sneak_peak'
		});

		if (form.values.subject) signupParams.set('subject', form.values.subject);
		if (form.values.examBoard) signupParams.set('examBoard', form.values.examBoard);
		if (form.values.paper) signupParams.set('paper', form.values.paper);

		return `${process.env.NEXT_PUBLIC_DASHBOARD_APP_URL}/signup?${signupParams.toString()}`;
	}, [form.values.examBoard, form.values.paper, form.values.subject]);

	function trackStepCompleted(stepIndex: number) {
		const currentStep = STEP_LABELS[stepIndex] ?? 'unknown';
		trackSneakPeakStepCompleted(currentStep, {
			active_step_index: stepIndex,
			subject: form.values.subject || undefined,
			exam_board: form.values.examBoard || undefined,
			exam_level: 'a_level',
			paper: form.values.paper || undefined
		});
	}

	function handleClose() {
		onClose();
		if (generationTimer) {
			clearTimeout(generationTimer);
			setGenerationTimer(null);
		}
		setTimeout(() => setActive(0), 500);
	}

	function handleSelectSubject(subject: Subject) {
		form.setFieldValue('subject', subject);
		form.setFieldValue('examBoard', '');
		form.setFieldValue('course', []);
		form.setFieldValue('paper', '');
		form.setFieldValue('sneak_peak_questions', []);
	}

	function handleContinueSubject() {
		if (!form.values.subject) return;
		trackStepCompleted(0);
		setActive(1);
	}

	function handleSelectExamBoard(examBoard: ExamBoard) {
		form.setFieldValue('examBoard', examBoard);
		form.setFieldValue('paper', '');
		form.setFieldValue('sneak_peak_questions', []);
	}

	function handleGeneratePaper(paper: string) {
		if (!form.values.subject || !form.values.examBoard) return;

		const questionAnswers = SNEAK_PEAK_QUESTION_ANSWERS[form.values.subject as Subject] ?? [];
		form.setFieldValue('paper', paper);
		form.setFieldValue('sneak_peak_questions', questionAnswers);

		trackStepCompleted(1);
		trackSneakPeakEngagement({
			subject: form.values.subject,
			exam_board: form.values.examBoard,
			exam_level: 'a_level',
			paper,
			question_count: questionAnswers.length
		});

		setActive(GENERATION_STEP_INDEX);
		if (generationTimer) clearTimeout(generationTimer);

		const timer = setTimeout(() => {
			trackSneakPeakStepCompleted('paper_selection', {
				active_step_index: GENERATION_STEP_INDEX,
				subject: form.values.subject || undefined,
				exam_board: form.values.examBoard || undefined,
				exam_level: 'a_level',
				paper
			});
			setActive(REVEAL_STEP_INDEX);
			setGenerationTimer(null);
		}, GENERATION_DELAY_MS);

		setGenerationTimer(timer);
	}

	function handleBack() {
		if (generationTimer) {
			clearTimeout(generationTimer);
			setGenerationTimer(null);
		}
		setActive(current => Math.max(current - 1, 0));
	}

	function handleUnlock() {
		trackLandingCtaClick('Unlock full Paper', 'sneak-peak');
		trackSignupCtaClick({
			source: 'sneak_peak',
			subject: form.values.subject || undefined,
			exam_board: form.values.examBoard || undefined,
			paper: form.values.paper || undefined
		});
	}

	if (!opened) return null;

	return (
		<SneakPeekFlow
			activeStep={active}
			subject={form.values.subject}
			examBoard={form.values.examBoard}
			paper={form.values.paper}
			course={form.values.course}
			questions={form.values.sneak_peak_questions}
			showWjec={showWjec}
			signupUrl={signupUrl}
			onClose={handleClose}
			onBack={handleBack}
			onSelectSubject={handleSelectSubject}
			onContinueSubject={handleContinueSubject}
			onSelectExamBoard={handleSelectExamBoard}
			onGeneratePaper={handleGeneratePaper}
			onUnlock={handleUnlock}
		/>
	);
};

export default SneakPeakSlideshow;
