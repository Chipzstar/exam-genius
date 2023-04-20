import React from 'react';
import { Box, Button, Group, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import { ExamBoardCard } from '@exam-genius/shared/ui';
import { useMediaQuery } from '@mantine/hooks';

const ChooseExamBoard = ({ next, prev, disabled, value, onChange }) => {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	return (
		<Page.Container classNames='h-full flex flex-col pb-2'>
			<header className='pb-20'>
				<Title align='center' order={2} size='h1' color='brand' weight={600}>
					Choose your exam board
				</Title>
			</header>
			<Page.Body extraClassNames='h-full justify-center'>
				<div className='pb-10'>
					<Radio.Group name='board' value={value} onChange={onChange}>
						<SimpleGrid cols={3} breakpoints={[{ maxWidth: '36rem', cols: 1, spacing: 'sm' }]}>
							<ExamBoardCard value='aqa' src='/static/images/aqa-icon.svg' />
							<ExamBoardCard value='edexcel' src='/static/images/edexcel-icon.svg' />
							<ExamBoardCard value='ocr' src='/static/images/ocr-icon.svg' />
						</SimpleGrid>
					</Radio.Group>
					<Group position='right' pt='xl'>
						<Box
							w={140}
							sx={
								mobileScreen
									? undefined
									: {
											position: 'absolute',
											right: 20,
											bottom: 20
									  }
							}
						>
							<Button fullWidth size='xl' disabled={disabled} onClick={next}>
								<Text>Next</Text>
							</Button>
						</Box>
					</Group>
				</div>
			</Page.Body>
		</Page.Container>
	);
};

export default ChooseExamBoard;
