import { ActionIcon, Card, List, ScrollArea, Space, Stack, Text, Title } from '@mantine/core';
import Page from '../../layout/Page';
import React from 'react';
import { useViewportSize } from '@mantine/hooks';
import { IconDownload } from '@tabler/icons-react';

const PaperID = () => {
	const { height } = useViewportSize();
	return (
		<Page.Container extraClassNames='justify-center w-full'>
			<ScrollArea.Autosize
				mah={height - 100}
				p='xl'
				styles={theme => ({
					root: {
						padding: theme.spacing.xl
					},
					viewport: {
						padding: theme.spacing.xl
					}
				})}
			>
				<Card shadow='sm' radius='md' className='w-full' p='xl'>
					<div className='flex justify-center'>
						<Stack justify='center' align='center'>
							<Title color='brand'>ExamGenius</Title>
							<Text size={30} weight={600}>
								Edexcel Maths - Pure Maths 1
							</Text>
							<Text size='lg'>A1 Predicted Paper</Text>
						</Stack>
						<ActionIcon
							size='xl'
							sx={{
								position: 'absolute',
								right: 25
							}}
						>
							<IconDownload />
						</ActionIcon>
					</div>
					<Space h='xl' />
					<List listStyleType='disc' spacing='xl'>
						<List.Item>Clone or download repository from GitHub</List.Item>
						<List.Item>Install dependencies with yarn</List.Item>
						<List.Item>To start development server run npm start command</List.Item>
						<List.Item>Run tests to make sure your changes do not break the build</List.Item>
						<List.Item>Submit a pull request once you are done</List.Item>
					</List>
				</Card>
			</ScrollArea.Autosize>
		</Page.Container>
	);
};

export default PaperID;
