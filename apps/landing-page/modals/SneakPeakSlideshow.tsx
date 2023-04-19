import React, { useEffect, useState } from 'react';
import { Code, Modal, Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import ChooseSubject from '../containers/ChooseSubject';
import ChooseExamBoard from '../containers/ChooseExamBoard';
import ChoosePaper from '../containers/ChoosePaper';
import { SUBJECT_PAPERS } from '@exam-genius/util-shared';

const SneakPeakSlideshow = ({ opened, onClose }) => {
	const [active, setActive] = useState(0);
	const form = useForm({
		initialValues: {
			subject: '',
			examBoard: '',
			course: []
		}
	});

	useEffect(() => {
		const storedValue = window.localStorage.getItem('form');
		if (storedValue) {
			try {
				form.setValues(JSON.parse(window.localStorage.getItem('form')));
			} catch (e) {
				console.log('Failed to parse stored value');
			}
		}
	}, []);

	useEffect(() => {
		form.reset();
	}, []);

	useEffect(() => {
		window.localStorage.setItem('form', JSON.stringify(form.values));
	}, [form.values]);

	useEffect(() => {
		const { subject, examBoard } = form.values;
		if (subject && examBoard) form.setFieldValue('course', Object.entries(SUBJECT_PAPERS[subject][examBoard]));
	}, [form.values.subject, form.values.examBoard]);

	const nextStep = () =>
		setActive(current => {
			if (form.validate().hasErrors) {
				return current;
			}
			return current < 3 ? current + 1 : current;
		});

	const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));
	return (
		<Modal opened={opened} onClose={onClose} centered fullScreen closeOnClickOutside closeOnEscape>
			<Stepper
				active={active}
				breakpoint='sm'
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
					<ChoosePaper next={nextStep} prev={prevStep} course={form.values.course} />
				</Stepper.Step>
				<Stepper.Completed>
					Completed! Form values:
					<Code block mt='xl'>
						{JSON.stringify(form.values, null, 2)}
					</Code>
				</Stepper.Completed>
			</Stepper>
		</Modal>
	);
};

export default SneakPeakSlideshow;
