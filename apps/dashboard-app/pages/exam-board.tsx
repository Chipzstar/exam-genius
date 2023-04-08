import React from 'react';
import { Box, Button, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import ExamBoardCard from '../components/ExamBoardCard';
import Link from 'next/link';
import { PATHS } from '../utils/constants';

const ExamBoard = () => {
	return (
		<Page.Container extraClassNames='bg-white'>
			<header className='py-6'>
				<Title align='center' order={2} size='h1' color='brand' weight={600}>
					Choose your exam board
				</Title>
			</header>
			<Page.Body extraClassNames='justify-center'>
				<Radio.Group name='board'>
					<SimpleGrid cols={3}>
						<ExamBoardCard value='aqa' src='/static/images/aqa-icon.svg' />
						<ExamBoardCard value='edexcel' src='/static/images/edexcel-icon.svg' />
						<ExamBoardCard value='ocr' src='/static/images/ocr-icon.svg' />
					</SimpleGrid>
				</Radio.Group>
			</Page.Body>
			<Page.Footer extraClassNames='justify-end'>
				<Link href={PATHS.HOME} passHref>
					<Box w={140} pb='xs'>
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
