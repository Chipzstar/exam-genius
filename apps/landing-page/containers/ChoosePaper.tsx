import React, { useState } from 'react';
import Page from '../layout/Page';
import { Button, Card, Group, Text, Title } from '@mantine/core';
import Image from 'next/image';
import CustomLoader from '../components/CustomLoader';
import { CourseInfo, SNEAK_PEAK_QUESTION_ANSWERS } from '@exam-genius/shared/utils';
import { UseFormReturnType } from '@mantine/form';
import { FormValues } from '../utils/types';

interface Props {
	course: [string, CourseInfo][];
	next: () => void;
	prev: () => void;
	form: UseFormReturnType<FormValues>;
}

const ChoosePaper = ({ course, next, prev, form } : Props) => {
	const [loading, setLoading] = useState(false);

	const handleSubmit = (unit_name: string) => {
		setLoading(true);
		form.setFieldValue("paper", unit_name)
		const question_answers = SNEAK_PEAK_QUESTION_ANSWERS[form.values.subject]
		console.log(question_answers)
		form.setFieldValue("sneak_peak_questions", question_answers)
		setTimeout(() => {
			setLoading(false);
			next();
		}, 2500)
	}

	return (
		<Page.Container classNames='h-full flex flex-col pb-2'>
			<CustomLoader opened={loading} onClose={() => setLoading(false)} text={"Generating your AI-Powered Predicted Papers..."}/>
			<header className="flex flex-col items-center space-y-6">
				<Title align='center' order={2} size='h1' color='brand' weight={600}>
					Choose a paper
				</Title>
				<Text w={400} align='center' weight={500}>Choose a paper below to take a sneak peak at what you get with ExamGenius</Text>
			</header>
			<Page.Body extraClassNames='h-full justify-center'>
				{course.map(([unit_name, unit]) => (
					<Card shadow='sm' radius='md' my='sm' key={unit_name}>
						<Group align='center' p='md' position='apart'>
							<div className='flex items-center grow space-x-6'>
								<Image src={unit.icon} width={100} height={100} alt='maths-icon' />
								<div className='flex flex-col space-y-4'>
									<Title order={1} size='h2' weight={600}>
										{unit.label}
									</Title>
									{unit.papers.map((paper, index) => (
										<Text key={index} size='xl' weight={500}>
											{paper.name}
										</Text>
									))}
								</div>
							</div>
							<div className='shrink grow-0 flex-end justify-end right-0'>
								<Button type="button" size='lg' onClick={() => handleSubmit(unit_name)}>
									<Text weight='normal'>{'Get Papers'}</Text>
								</Button>
							</div>
						</Group>
					</Card>
				))}
			</Page.Body>
		</Page.Container>
	)
};

export default ChoosePaper;
