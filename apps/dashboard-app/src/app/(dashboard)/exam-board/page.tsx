'use client';

import React, { useEffect } from 'react';
import { Box, Button, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import Page from '~/layout/Page';
import { ExamBoardCard } from '@exam-genius/shared/ui';
import getStripe from '~/utils/loadStripe';
import { useMediaQuery } from '@mantine/hooks';
import { CHECKOUT_TYPE } from '~/utils/constants';
import { notifyError } from '~/utils/functions';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import type { ExamBoard, Subject } from '@exam-genius/shared/utils';
import { useValue } from '@legendapp/state/react';
import { appStore$ } from '~/store/app.store';

if (typeof window !== 'undefined') {
	getStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '').then(r => console.log('Stripe loaded', r));
}

export default function ExamBoardPage() {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const subject = useValue(appStore$.onboarding.subject);
	const board = useValue(appStore$.onboarding.board);
	const router = useRouter();
	const { mutateAsync: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation();
	const { mutateAsync: checkDuplicateCourse } = api.course.checkDuplicateCourse.useMutation();

	useEffect(() => {
		appStore$.onboarding.board.set('');
	}, []);

	async function openCheckout() {
		try {
			const is_dupe = await checkDuplicateCourse({
				subject: subject as Subject,
				exam_board: board as ExamBoard
			});
			if (is_dupe) {
				notifyError('duplicate-course-error', 'You already own this course!', <IconX size={20} />);
				return;
			}
			const { checkout_url } = await createCheckoutSession({
				type: CHECKOUT_TYPE.COURSE,
				subject: subject as Subject,
				exam_board: board as ExamBoard
			});
			if (checkout_url) {
				router.push(checkout_url);
			}
		} catch (err: any) {
			console.error(err);
			notifyError('open-checkout-failed', err.message, <IconX size={20} />);
		}
	}

	return (
		<Page.Container extraClassNames='bg-[var(--mantine-color-body)]'>
			<header className='py-6'>
				<Title ta='center' order={2} size={mobileScreen ? 'h2' : 'h1'} c='brand' fw={600}>
					Choose your exam board
				</Title>
			</header>
			<Page.Body extraClassNames='justify-center'>
				<Radio.Group name='board' value={board} onChange={v => appStore$.onboarding.board.set(v)}>
					<SimpleGrid cols={3}>
						<ExamBoardCard value='aqa' src='/static/images/aqa-icon.svg' />
						<ExamBoardCard value='edexcel' src='/static/images/edexcel-icon.svg' />
						<ExamBoardCard value='ocr' src='/static/images/ocr-icon.svg' />
					</SimpleGrid>
				</Radio.Group>

				<Box
					w={140}
					style={
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
}
