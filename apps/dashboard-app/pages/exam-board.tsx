import React from 'react';
import { Box, Button, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import ExamBoardCard from '../components/ExamBoardCard';
import getStripe from '../utils/loadStripe';
import { useLocalStorage } from '@mantine/hooks';

getStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).then(r => console.log('Stripe loaded', r));

const ExamBoard = () => {
	const [price_id, setPriceId] = useLocalStorage<string>({
		key: 'priceId',
		defaultValue: '',
	});

	React.useEffect(() => {
		// Check to see if this is a redirect back from Checkout
		const query = new URLSearchParams(window.location.search);
		if (query.get('success')) {
			console.log('Order placed! You will receive an email confirmation.');
		}
		if (query.get('canceled')) {
			console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
		}
	}, []);

	return (
		<Page.Container extraClassNames='bg-white'>
			<header className='py-6'>
				<Title align='center' order={2} size='h1' color='brand' weight={600}>
					Choose your exam board
				</Title>
			</header>
			<Page.Body extraClassNames='justify-center'>
				<form action='/api/stripe/checkout?mode=subscription' method='POST' className="pb-10">
					<input name="price_id" id="price-id" value={price_id} hidden/>
					<Radio.Group name='board'>
						<SimpleGrid cols={3}>
							<ExamBoardCard value='aqa' src='/static/images/aqa-icon.svg' />
							<ExamBoardCard value='edexcel' src='/static/images/edexcel-icon.svg' />
							<ExamBoardCard value='ocr' src='/static/images/ocr-icon.svg' />
						</SimpleGrid>
					</Radio.Group>

					<Box w={140} sx={{
						position: 'absolute',
						right: 20,
						bottom: 20,
					}}>
						<Button type='submit' fullWidth size='xl'>
							<Text>Next</Text>
						</Button>
					</Box>
				</form>
			</Page.Body>
		</Page.Container>
	);
};

export default ExamBoard;
