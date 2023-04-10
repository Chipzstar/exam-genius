import { Box, Button, Group, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';
import Page from '../layout/Page';
import SubjectCard from '../components/SubjectCard';
import Link from 'next/link';
import { PATHS, SUBJECT_PRICE_IDS } from '../utils/constants';
import { useLocalStorage } from '@mantine/hooks';

const ChooseSubject = () => {
	const [price_id, setPriceId] = useLocalStorage<string>({
		key: 'priceId',
		defaultValue: ''
	});
	return (
		<Page.Container extraClassNames='bg-white'>
			<header className='py-6'>
				<Title align='center' order={2} size='h1' color='brand' weight={600}>
					Choose your Subjects
				</Title>
			</header>
			<Page.Body extraClassNames='justify-between py-8'>
				<Radio.Group
					name='subject'
					onChange={value => {
						setPriceId(value);
						console.log(value);
					}}
				>
					<SimpleGrid cols={3}>
						<SubjectCard
							subject='Maths'
							src='/static/images/maths-icon.svg'
							priceId={SUBJECT_PRICE_IDS.maths}
						/>
						<SubjectCard
							subject='Biology'
							src='/static/images/biology-icon.svg'
							priceId={SUBJECT_PRICE_IDS.biology}
						/>
						<SubjectCard
							subject='Chemistry'
							src='/static/images/chemistry-icon.svg'
							priceId={SUBJECT_PRICE_IDS.chemistry}
						/>
						<SubjectCard
							subject='Economics'
							src='/static/images/economics-icon.svg'
							priceId={SUBJECT_PRICE_IDS.economics}
						/>
						<SubjectCard
							subject='Physics'
							src='/static/images/physics-icon.svg'
							priceId={SUBJECT_PRICE_IDS.physics}
						/>
						<SubjectCard
							subject='Psychology'
							src='/static/images/psychology-icon.svg'
							priceId={SUBJECT_PRICE_IDS.psychology}
						/>
					</SimpleGrid>
				</Radio.Group>
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
