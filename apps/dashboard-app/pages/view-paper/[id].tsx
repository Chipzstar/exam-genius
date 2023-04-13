import { ActionIcon, Button, Card, List, ScrollArea, Space, Stack, Text, Title } from '@mantine/core';
import Page from '../../layout/Page';
import React from 'react';
import { useViewportSize } from '@mantine/hooks';
import { IconArrowLeft, IconDownload } from '@tabler/icons-react';
import { useRouter } from 'next/router';

const PaperID = () => {
	const router = useRouter();
	const { height } = useViewportSize();
	return (
		<Page.Container>
			<header className='flex items-center jusitfy-end p-6'>
				<Button leftIcon={<IconArrowLeft />} size='md' variant='outline' onClick={router.back}>
					Back
				</Button>
			</header>
			<Page.Body extraClassNames='justify-center w-full'>
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
								<Text size='lg'>AI Predicted Paper</Text>
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
							<List.Item>
								Solve the quadratic equation x^2 + 3x - 10 = 0, giving your answers correct to two
								decimal places. [4 marks]
							</List.Item>
							<List.Item>
								Differentiate the function y = x^3 - 5x^2 + 2x - 7 with respect to x. [4 marks]
							</List.Item>
							<List.Item>The circle C has equation x^2 + y^2 - 2x + 6y - 6 = 0.</List.Item>
							<List.Item>
								(a) Write down the coordinates of the centre of the circle C. [2 marks]
							</List.Item>
							<List.Item>(b) Find the radius of the circle C. [3 marks]</List.Item>
							<List.Item>
								Solve the equation 3sin(2x) = 2cos(x) for 0 ≤ x ≤ 360°, giving your answers correct to
								one decimal place. [5 marks]
							</List.Item>
							<List.Item>Differentiate the function y = ln(5x + 4). [3 marks]</List.Item>
							<List.Item>
								The line L1 has equation y = 2x + 1. The line L2 is perpendicular to L1 and passes
								through the point (-2, 3).
							</List.Item>
							<List.Item>(a) Find the equation of the line L2. [4 marks]</List.Item>
							<List.Item>
								(b) Find the coordinates of the point where the lines L1 and L2 intersect. [3 marks]
							</List.Item>
						</List>
					</Card>
				</ScrollArea.Autosize>
			</Page.Body>
		</Page.Container>
	);
};

export default PaperID;
