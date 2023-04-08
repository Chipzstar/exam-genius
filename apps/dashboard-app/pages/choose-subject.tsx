import { Box, Button, Group, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';
import Page from '../layout/Page';
import SubjectCard from '../components/SubjectCard';
import Link from 'next/link';
import { PATHS } from '../utils/constants';

const ChooseSubject = () => {
	return (
		<Page.Container extraClassNames='bg-white'>
			<header className='py-6'>
				<Title align='center' order={2} size='h1' color='brand' weight={600}>
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
					<Link href={PATHS.EXAM_BOARD} passHref>
						<Box w={140}>
							<Button fullWidth size='xl'>
								<Text>Next</Text>
							</Button>
						</Box>
					</Link>
				</Group>
			</Page.Body>
		</Page.Container>
	);
};

export default ChooseSubject;
