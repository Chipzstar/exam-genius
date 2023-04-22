import React, { useEffect } from 'react';
import { Box, Button, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import { ExamBoardCard } from '@exam-genius/shared/ui';
import getStripe from '../utils/loadStripe';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { CHECKOUT_TYPE } from '../utils/constants';

getStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).then(r => console.log('Stripe loaded', r));

const ExamBoard = () => {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const [subject, setSubject] = useLocalStorage<string>({
		key: 'subject',
		defaultValue: ''
	});
	const [board, setBoard] = useLocalStorage<string>({
		key: 'board',
		defaultValue: ''
	});

	useEffect(() => {
		setBoard('');
	}, []);

	return (
		<Page.Container extraClassNames='bg-white'>
			<header className='py-6'>
				<Title align='center' order={2} size={mobileScreen ? 'h2' : 'h1'} color='brand' weight={600}>
					Choose your exam board
				</Title>
			</header>
			<Page.Body extraClassNames='justify-center'>
				<form action='/api/stripe/checkout?mode=payment' method='POST' className='pb-10'>
					<input name='type' id='type' value={CHECKOUT_TYPE.COURSE} hidden />
					<input name='exam_board' id='exam-board' value={board} hidden />
					<input name='subject' id='subject' value={subject} hidden />
					<Radio.Group name='board' value={board} onChange={setBoard}>
						<SimpleGrid cols={3} breakpoints={[{ maxWidth: '36rem', cols: 1, spacing: 'sm' }]}>
							<ExamBoardCard value='aqa' src='/static/images/aqa-icon.svg' />
							<ExamBoardCard value='edexcel' src='/static/images/edexcel-icon.svg' />
							<ExamBoardCard value='ocr' src='/static/images/ocr-icon.svg' />
						</SimpleGrid>
					</Radio.Group>
					<Box
						w={140}
						sx={
							mobileScreen
								? { float: 'right', paddingTop: '2em' }
								: {
										position: 'absolute',
										right: 20,
										bottom: 20
								  }
						}
					>
						<Button type='submit' fullWidth size={mobileScreen ? 'lg' : 'xl'} disabled={!board}>
							<Text>Next</Text>
						</Button>
					</Box>
				</form>
			</Page.Body>
		</Page.Container>
	);
};

export default ExamBoard;
