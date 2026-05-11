import React, { useEffect, useState } from 'react';
import { Modal, Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import ChooseSubject from '../containers/ChooseSubject';
import ChooseExamBoard from '../containers/ChooseExamBoard';
import ChoosePaper from '../containers/ChoosePaper';
import type { ExamBoard, Subject } from '@exam-genius/shared/utils';
import { getSubjectPapersCatalog } from '@exam-genius/shared/utils';
import { FormValues } from '../utils/types';
import SneakPeak from '../containers/SneakPeak';
import { trackSneakPeakOpened, trackSneakPeakStepCompleted } from '../utils/analytics';

const STEP_LABELS = ['subject', 'exam_board', 'paper_selection'] as const;
const COMPLETED_STEP_INDEX = 3;

const SneakPeakSlideshow = ({ opened, onClose }) => {
	const [active, setActive] = useState(0);

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

	const nextStep = () =>
		setActive(current => {
			if (form.validate().hasErrors) {
				return current;
			}

			const currentStep = STEP_LABELS[current] ?? 'unknown';
			trackSneakPeakStepCompleted(currentStep, {
				active_step_index: current,
				subject: form.values.subject || undefined,
				exam_board: form.values.examBoard || undefined,
				exam_level: 'a_level',
				paper: form.values.paper || undefined
			});

			return current < COMPLETED_STEP_INDEX ? current + 1 : current;
		});

	const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));

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
				<Stepper.Step label='Subject' description='Subject'>
					<ChooseSubject next={nextStep} disabled={!form.values.subject} onChange={value => form.setFieldValue('subject', value)} />
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
					/>
				</Stepper.Completed>
			</Stepper>
		</Modal>
	);
};

export default SneakPeakSlideshow;
