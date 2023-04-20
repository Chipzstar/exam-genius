import React from 'react';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import { useMediaQuery } from '@mantine/hooks';

const SneakPeak = ({ prev, sneak_peak_questions }) => {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	return (
		<Page.Container classNames='h-full flex flex-col pb-2'>
			<header className='pb-20'>
				<Title align='center' order={1} size={mobileScreen ? 'h1' : 50} color='brand' weight={600}>
					Your sneak peak 🎉
				</Title>
			</header>
			<Page.Body extraClassNames='h-full justify-center items-center'>
				{sneak_peak_questions.map(({ question, answer, chance }, index) => (
					<Card shadow='sm' radius='md' my='sm' key={index} maw={mobileScreen ? undefined : 1000}>
						<div className='flex-col md:flex items-center'>
							<Group align='center' p='md' position='apart'>
								<div className='flex grow items-center space-x-6'>
									<div className='flex flex-col space-y-4'>
										<Title order={1} size='h2' weight={600}>
											{index + 1}. {question}
										</Title>
										<Text key={index} size='md' weight={400}>
											{answer}
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
				<Group grow position='center' pt='xl'>
					<a href='https://app.exam-genius.com/signup' className='flex-end right-0 shrink grow-0 justify-end'>
						<Button size='lg'>
							<Text weight='normal'>🔒 Unlock full Paper</Text>
						</Button>
					</a>
				</Group>
			</Page.Body>
		</Page.Container>
	);
};

export default SneakPeak;
