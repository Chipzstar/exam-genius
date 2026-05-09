import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import ChooseSubject from '../containers/ChooseSubject';
import ChooseExamBoard from '../containers/ChooseExamBoard';
import ChoosePaper from '../containers/ChoosePaper';
import ChooseExamLevel from '../containers/ChooseExamLevel';
import type { ExamBoard, ExamLevel, Subject } from '@exam-genius/shared/utils';
import { getSubjectPapersCatalog } from '@exam-genius/shared/utils';
import { FormValues } from '../utils/types';
import SneakPeak from '../containers/SneakPeak';
import { trackSneakPeakOpened, trackSneakPeakStepCompleted } from '../utils/analytics';
import { useExamLevelSelectionFlag } from '../hooks/useExamLevelSelectionFlag';

const SneakPeakSlideshow = ({ opened, onClose }) => {
	const [active, setActive] = useState(0);
	const { enabled: levelChoiceEnabled, ready: flagReady } = useExamLevelSelectionFlag();
	const showLevelStep = flagReady && levelChoiceEnabled;

	const completedStepIndex = showLevelStep ? 4 : 3;

	const stepLabels = useMemo(
		() =>
			showLevelStep
				? (['exam_level', 'subject', 'exam_board', 'paper_selection'] as const)
				: (['subject', 'exam_board', 'paper_selection'] as const),
		[showLevelStep]
	);

	const form = useForm<FormValues>({
		initialValues: {
			examLevel: '',
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
				examLevel: parsed.examLevel ?? '',
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
		const subject = form.values.subject as Subject | '';
		const examBoard = form.values.examBoard as ExamBoard | '';
		const level: ExamLevel = form.values.examLevel === 'as_level' ? 'as_level' : 'a_level';
		if (!subject || !examBoard) return;
		const catalog = getSubjectPapersCatalog(level);
		const boardMap = catalog[subject]?.[examBoard];
		if (boardMap) {
			form.setFieldValue('course', Object.entries(boardMap));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- derived catalog refresh only when selections change
	}, [form.values.subject, form.values.examBoard, form.values.examLevel]);

	useEffect(() => {
		if (!opened) return;

		trackSneakPeakOpened('sneak-peak-modal');
	}, [opened]);

	const resolvedExamLevelForAnalytics = (): ExamLevel | undefined => {
		if (!showLevelStep) return 'a_level';
		if (form.values.examLevel === 'as_level' || form.values.examLevel === 'a_level') {
			return form.values.examLevel;
		}
		return undefined;
	};

	const nextStep = () =>
		setActive(current => {
			if (form.validate().hasErrors) {
				return current;
			}

			const currentStep = stepLabels[current] ?? 'unknown';
			trackSneakPeakStepCompleted(currentStep, {
				active_step_index: current,
				subject: form.values.subject || undefined,
				exam_board: form.values.examBoard || undefined,
				exam_level: resolvedExamLevelForAnalytics(),
				paper: form.values.paper || undefined
			});

			return current < completedStepIndex ? current + 1 : current;
		});

	const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));

	const subjectPrefix = form.values.examLevel === 'as_level' ? 'AS-Level' : 'A-Level';

	return (
		<Modal
			opened={opened}
			onClose={() => {
				onClose();
				setTimeout(() => setActive(0), 500);
			}}
			centered
			fullScreen
			closeOnClickOutside
			closeOnEscape
		>
			<Stepper
				active={active}
				classNames={{
					stepBody: 'hidden',
					stepWrapper: 'hidden',
					step: 'hidden',
					steps: 'hidden',
					stepLabel: 'hidden',
					stepDescription: 'hidden',
					separator: 'hidden'
				}}
			>
				{showLevelStep ? (
					<Stepper.Step label='Exam level' description='Qualification'>
						<ChooseExamLevel
							next={nextStep}
							disabled={!form.values.examLevel}
							value={form.values.examLevel}
							onChange={value => form.setFieldValue('examLevel', value as ExamLevel)}
						/>
					</Stepper.Step>
				) : null}

				<Stepper.Step label='Subject' description='Subject'>
					<ChooseSubject
						next={nextStep}
						disabled={!form.values.subject}
						onChange={value => form.setFieldValue('subject', value)}
						subjectTitlePrefix={subjectPrefix}
					/>
				</Stepper.Step>

				<Stepper.Step label='Exam board' description='Board'>
					<ChooseExamBoard
						next={nextStep}
						prev={prevStep}
						value={form.values.examBoard}
						disabled={!form.values.examBoard}
						onChange={value => form.setFieldValue('examBoard', value)}
					/>
				</Stepper.Step>

				<Stepper.Step label='Paper' description='Paper'>
					<ChoosePaper next={nextStep} prev={prevStep} course={form.values.course} form={form} />
				</Stepper.Step>
				<Stepper.Completed>
					<SneakPeak
						prev={prevStep}
						sneak_peak_questions={form.values.sneak_peak_questions}
						subject={form.values.subject}
						examBoard={form.values.examBoard}
						paper={form.values.paper}
						examLevel={form.values.examLevel === 'as_level' ? 'as_level' : 'a_level'}
					/>
				</Stepper.Completed>
			</Stepper>
		</Modal>
	);
};

export default SneakPeakSlideshow;
