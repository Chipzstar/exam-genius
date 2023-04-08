import { Button, Group, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';
import Page from '../layout/Page';
import SubjectCard from '../components/SubjectCard';

const AddCourse = () => {
	return (
		<Page.Container>
			<header className='py-6'>
				<Title align='center' order={2} size='h1' color='brand' weight='normal'>
					Choose your Subjects
				</Title>
			</header>
			<Page.Body extraClassNames='justify-between py-8'>
				<SimpleGrid cols={3}>
					<SubjectCard subject='Maths' src='/static/images/maths-icon.svg' />
					<SubjectCard subject='Biology' src='/static/images/biology-icon.svg' />
					<SubjectCard subject='Chemistry' src='/static/images/chemistry-icon.svg' />
					<SubjectCard subject='Economics' src='/static/images/economics-icon.svg' />
					<SubjectCard subject='Physics' src='/static/images/physics-icon.svg' />
					<SubjectCard subject='Psychology' src='/static/images/psychology-icon.svg' />
				</SimpleGrid>
				<Group position='right' pt='lg'>
					<Button size='xl'>
						<Text>Next</Text>
					</Button>
				</Group>
			</Page.Body>
		</Page.Container>
	);
};

export default AddCourse;
