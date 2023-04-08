import React from 'react';
import { Box, Button, SimpleGrid, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import ExamBoardCard from '../components/ExamBoardCard';
import Link from 'next/link';
import { PATHS } from '../utils/constants';

const ExamBoard = () => {
	return (
		<Page.Container>
			<header className='py-6'>
				<Title align='center' order={2} size='h1' color='brand' weight={600}>
					Choose your exam board
				</Title>
			</header>
			<Page.Body extraClassNames='justify-center py-8'>
				<SimpleGrid cols={3}>
					<ExamBoardCard src='/static/images/aqa-icon.svg' />
					<ExamBoardCard src='/static/images/edexcel-icon.svg' />
					<ExamBoardCard src='/static/images/ocr-icon.svg' />
				</SimpleGrid>
			</Page.Body>
			<Page.Footer extraClassNames='justify-end'>
				<Link href={PATHS.HOME} passHref>
					<Box w={140}>
						<Button fullWidth size='xl'>
							<Text>Next</Text>
						</Button>
					</Box>
				</Link>
			</Page.Footer>
		</Page.Container>
	);
};

export default ExamBoard;
