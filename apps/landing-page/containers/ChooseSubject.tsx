import React from 'react';
import { Box, Button, Group, Radio, SimpleGrid, Title } from '@mantine/core';
import Page from '../layout/Page';
import { SubjectCard } from '@exam-genius/shared/ui';
import { formatExamLevelForDisplay } from '@exam-genius/shared/utils';

const ChooseSubject = ({
	next,
	disabled,
	onChange,
	subjectTitlePrefix = formatExamLevelForDisplay('a_level')
}) => {
	return (
		<Page.Container classNames='flex flex-col pb-2 h-full'>
			<header className='pb-6'>
				<Title ta="center" order={2} size="h1" c="brand.5" fw={600}>
					Choose your Subjects
				</Title>
			</header>
			<Page.Body extraClassNames='justify-between py-4'>
				<Radio.Group name='subject' onChange={onChange}>
					<SimpleGrid cols={{ base: 1, xs: 3 }}>
						<SubjectCard subjectTitlePrefix={subjectTitlePrefix} subject='Maths' src='/static/images/maths-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectTitlePrefix} subject='Biology' src='/static/images/biology-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectTitlePrefix} subject='Chemistry' src='/static/images/chemistry-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectTitlePrefix} subject='Economics' src='/static/images/economics-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectTitlePrefix} subject='Physics' src='/static/images/physics-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectTitlePrefix} subject='Psychology' src='/static/images/psychology-icon.svg' />
					</SimpleGrid>
				</Radio.Group>
				<Group justify="flex-end" pt="lg">
					<Box w={140}>
						<Button fullWidth onClick={next} disabled={disabled} size='xl'>
							Next
						</Button>
					</Box>
				</Group>
			</Page.Body>
		</Page.Container>
	);
};

export default ChooseSubject;
