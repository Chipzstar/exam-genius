import React, { useEffect } from 'react';
import { Box, Button, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import { ExamBoardCard } from '@exam-genius/shared/ui';
import getStripe from '../utils/loadStripe';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { CHECKOUT_TYPE } from '../utils/constants';
import { notifyError } from '../utils/functions';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import { ExamBoard, Subject } from '@exam-genius/shared/utils';

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
	const router = useRouter();
	const { mutateAsync: createCheckoutSession } = trpc.stripe.createCheckoutSession.useMutation();
	const { mutateAsync: checkDuplicateCourse } = trpc.course.checkDuplicateCourse.useMutation();
	const [price_id, setPriceId] = useLocalStorage<string>({
		key: 'priceId',
		defaultValue: ''
	})

	useEffect(() => {
		setBoard('');
	}, []);

	async function openCheckout() {
		try {
			// check if the user already owns this course
			const is_dupe = await checkDuplicateCourse({
				subject: subject as Subject,
                exam_board: board as ExamBoard
			})
			if (is_dupe) {
                notifyError('duplicate-course-error', 'You already own this course!', <IconX size={20} />);
                return;
            }
			const { checkout_url } = await createCheckoutSession({
				type: CHECKOUT_TYPE.COURSE,
				price_id: price_id,
				subject: subject as Subject,
				exam_board: board as ExamBoard,
			});
			if(checkout_url) {
				void router.push(checkout_url);
			}
		} catch (err) {
			console.error(err);
			notifyError('open-checkout-failed', err.message, <IconX size={20} />);
		}
	}

	return (
		<Page.Container extraClassNames='bg-white'>
			<header className='py-6'>
				<Title align='center' order={2} size={mobileScreen ? 'h2' : 'h1'} color='brand' weight={600}>
					Choose your exam board
				</Title>
			</header>
			<Page.Body extraClassNames='justify-center'>
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
					<Button fullWidth size={mobileScreen ? 'lg' : 'xl'} disabled={!board} onClick={() => openCheckout()}>
						<Text>Next</Text>
					</Button>
				</Box>
			</Page.Body>
		</Page.Container>
	);
};

export default ExamBoard;
