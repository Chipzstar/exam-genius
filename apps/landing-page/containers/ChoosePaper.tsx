import React from 'react';
import Page from '../layout/Page';
import { Button, Card, Group, Text, Title } from '@mantine/core';
import Image from 'next/image';

const ChoosePaper = ({ course, next, prev }) => {
	return (
		<Page.Container classNames='h-full flex flex-col pb-2'>
			<header className="flex flex-col items-center space-y-6">
				<Title align='center' order={2} size='h1' color='brand' weight={600}>
					Choose a paper
				</Title>
				<Text w={400} align='center' weight={500}>Choose a paper below to take a sneak peak at what you get with ExamGenius</Text>
			</header>
			<Page.Body extraClassNames='h-full justify-center'>
				{course.map(([unit_name, unit]) => (
					<Card shadow='sm' radius='md' my='sm' key={unit_name}>
						<Group align='center' p='md' position='apart'>
							<div className='flex items-center grow space-x-6'>
								<Image src={unit.icon} width={100} height={100} alt='maths-icon' />
								<div className='flex flex-col space-y-4'>
									<Title order={1} size='h2' weight={600}>
										{unit.label}
									</Title>
									{unit.papers.map((paper, index) => (
										<Text key={index} size='xl' weight={500}>
											{paper.name}
										</Text>
									))}
								</div>
							</div>
							<div className='shrink grow-0 flex-end justify-end right-0'>
								<Button size='lg'>
									<Text weight='normal'>{'Get Papers'}</Text>
								</Button>
							</div>
						</Group>
					</Card>
				))}
			</Page.Body>
		</Page.Container>
	)
};

export default ChoosePaper;
