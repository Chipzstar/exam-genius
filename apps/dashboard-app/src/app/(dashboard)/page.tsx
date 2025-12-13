'use client';

import { Box, Button, Card, Divider, Group, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { PATHS } from '~/utils/constants';
import { api } from '~/trpc/react';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import Page from '~/layout/Page';

export default function HomePage() {
	const { height } = useViewportSize();
	const { data: courses, isLoading } = api.course.getCourses.useQuery();
	const mobileScreen = useMediaQuery('(max-width: 30em)');

	return (
		<Page.Container data_cy='homepage' extraClassNames='flex flex-col py-6 overflow-y-hidden'>
			<Page.Body>
				<Title order={2} fw={600} mb='lg'>
					Courses 📚
				</Title>
				<ScrollArea.Autosize mah={height - 200}>
					{!courses || isLoading ? (
						<Box h={height - 200}>
							<LoadingOverlay visible={isLoading} />
						</Box>
					) : (
						courses.map((course, index) => (
							<Card key={index} shadow='sm' radius='md' mb='lg'>
								<div className='flex grow flex-col items-center justify-center space-y-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-6'>
									<div className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
										<Image
											src={`/static/images/${course.subject}-icon.svg`}
											width={mobileScreen ? 75 : 100}
											height={mobileScreen ? 75 : 100}
											alt='maths-icon'
										/>
										<div className='flex flex-col items-center space-y-2 sm:items-start'>
											<Title order={mobileScreen ? 3 : 2}>{course.name}</Title>
											<Text size={mobileScreen ? 'md' : 'xl'} fw={500}>
												Year {course.year_level}
											</Text>
										</div>
									</div>
									<Group justify='right'>
										<Link
											href={`${PATHS.COURSE}/${course.course_id}?subject=${course.subject}&board=${course.exam_board}`}
										>
											<Button size={mobileScreen ? 'md' : 'lg'}>
												<Text fw='normal'>{'Continue →'}</Text>
											</Button>
										</Link>
									</Group>
								</div>
							</Card>
						))
					)}
				</ScrollArea.Autosize>
				<Divider my='lg' />
				<div className='flex justify-end'>
					<Link href={PATHS.NEW_SUBJECT}>
						<Button size='lg'>
							<Text>{'Add Course'}</Text>
						</Button>
					</Link>
				</div>
			</Page.Body>
		</Page.Container>
	);
}

