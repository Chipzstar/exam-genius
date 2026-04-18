import React, { useEffect, useState } from 'react';
import { Modal, Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import ChooseSubject from '../containers/ChooseSubject';
import ChooseExamBoard from '../containers/ChooseExamBoard';
import ChoosePaper from '../containers/ChoosePaper';
import { SUBJECT_PAPERS } from '@exam-genius/shared/utils';
import { FormValues } from '../utils/types';
import SneakPeak from '../containers/SneakPeak';
import { trackSneakPeakOpened, trackSneakPeakStepCompleted } from '../utils/analytics';

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
		if (storedValue) {
			try {
				form.setValues(JSON.parse(storedValue));
			} catch (e) {
				console.log('Failed to parse stored value');
			}
		}
	}, []);

	useEffect(() => {
		window.localStorage.setItem('form', JSON.stringify(form.values));
	}, [form.values]);

	useEffect(() => {
		const { subject, examBoard } = form.values;
		if (subject && examBoard) form.setFieldValue('course', Object.entries(SUBJECT_PAPERS[subject][examBoard]));
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

			const currentStep = ['subject', 'exam_board', 'paper_selection'][current] ?? 'unknown';
			trackSneakPeakStepCompleted(currentStep, {
				active_step_index: current,
				subject: form.values.subject || undefined,
				exam_board: form.values.examBoard || undefined,
				paper: form.values.paper || undefined
			});

			return current < 3 ? current + 1 : current;
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
				<Stepper.Step label='First step' description='Profile settings'>
					<ChooseSubject
						next={nextStep}
						disabled={!form.values.subject}
						onChange={value => form.setFieldValue('subject', value)}
					/>
				</Stepper.Step>

				<Stepper.Step label='Second step' description='Personal information'>
					<ChooseExamBoard
						next={nextStep}
						prev={prevStep}
						value={form.values.examBoard}
						disabled={!form.values.examBoard}
						onChange={value => form.setFieldValue('examBoard', value)}
					/>
				</Stepper.Step>

				<Stepper.Step label='Final step' description='Social media'>
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
