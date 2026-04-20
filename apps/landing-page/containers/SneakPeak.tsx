import React from 'react';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import parse from 'html-react-parser';
import { trackLandingCtaClick, trackSignupCtaClick } from '../utils/analytics';

interface SneakPeakProps {
	prev: () => void;
	sneak_peak_questions: Array<{ question: string; answer: string; chance: number }>;
	subject?: string;
	examBoard?: string;
	paper?: string;
}

const SneakPeak = ({ prev, sneak_peak_questions, subject, examBoard, paper }: SneakPeakProps) => {
	const mobileScreen = useMediaQuery('(max-width: 48em)');
	const { width } = useViewportSize();
	const signupUrl = `https://app.exam-genius.com/signup?source=landing&phase=sneak_peak&subject=${encodeURIComponent(subject ?? '')}&examBoard=${encodeURIComponent(examBoard ?? '')}&paper=${encodeURIComponent(paper ?? '')}`;
	return (
		<Page.Container classNames='h-full flex flex-col pb-2'>
			<header className='pb-20'>
				<Title ta="center" order={1} size={mobileScreen ? 'h1' : '2.5rem'} c="brand.5" fw={600}>
					Your sneak peak 🎉
				</Title>
			</header>
			<Page.Body extraClassNames='h-full justify-center items-center'>
				{sneak_peak_questions.map(({ question, answer, chance }, index) => (
					<Card shadow='sm' radius='md' my='sm' key={index} miw={mobileScreen ? undefined : width - 300}>
						<div className='flex-col items-center'>
							<Group align="center" p="md" justify="space-between">
								<div className='flex grow items-center space-x-6'>
									<div className='flex flex-col space-y-4'>
										<Title order={1} size="h2" fw={600}>
											{index + 1}. {parse(question, { trim: true })}
										</Title>
										<Text key={index} size="md" fw={400}>
											{parse(answer, { trim: true })}
										</Text>
									</div>
								</div>
							</Group>
							<Stack miw={mobileScreen ? 20 : 200}>
								<div className='flex flex-col items-center'>
									<span className='text-primary  text-2xl font-medium'>{chance}%</span>
									<span className='text-center text-sm'>chance of showing up</span>
								</div>
							</Stack>
						</div>
					</Card>
				))}
				<Group grow justify="center" pt="xl">
					<a
						href={signupUrl}
						className='flex-end right-0 shrink grow-0 justify-end'
						onClick={() => {
							trackLandingCtaClick('Unlock full Paper', 'sneak-peak');
							trackSignupCtaClick({
								source: 'sneak_peak',
								subject: subject || undefined,
								exam_board: examBoard || undefined,
								paper: paper || undefined
							});
						}}
					>
						<Button size='lg'>
							<Text fw={400}>🔒 Unlock full Paper</Text>
						</Button>
					</a>
				</Group>
			</Page.Body>
		</Page.Container>
	);
};

export default SneakPeak;
