'use client';

import { Box, Button, Card, Group, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { PATHS } from '~/utils/constants';
import { api } from '~/trpc/react';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import Page from '~/layout/Page';
import { useValue } from '@legendapp/state/react';
import { appStore$ } from '~/store/app.store';
import { genCourseOrPaperName } from '~/utils/functions';
import type { ExamBoard, ExamLevel, Subject } from '@exam-genius/shared/utils';
import { AnimatedList } from '~/components/AnimatedList';
import { motion, useReducedMotion } from 'motion/react';

export default function HomePage() {
	const { height } = useViewportSize();
	const { data: courses, isLoading } = api.course.getCourses.useQuery();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const lastOpened = useValue(appStore$.lastOpenedPaper);
	const recentPapers = useValue(appStore$.recentPapers);
	const reduceMotion = useReducedMotion();

	// Calculate dynamic heights for optimal space usage
	const continueCardHeight = lastOpened ? 110 : 0;
	const recentPapersHeight = recentPapers.length > 0 ? 140 : 0;
	const coursesHeaderHeight = 70;
	const pageVerticalPadding = 48; // py-6 = 24px top + 24px bottom
	const bodyPadding = 48; // px-6 horizontal padding
	const reservedSpace = continueCardHeight + recentPapersHeight + coursesHeaderHeight + pageVerticalPadding + 40;
	const coursesScrollHeight = height - reservedSpace;

	return (
		<Page.Container data_cy='homepage' extraClassNames='flex flex-col py-6 overflow-y-hidden'>
			<Page.Body>
				{lastOpened && (
					<Card shadow='sm' radius='md' mb='md' p='md' withBorder data-cy='resume-learning-card'>
						<Group justify='space-between' align='flex-start' wrap='wrap' gap='sm'>
							<Box style={{ flex: 1, minWidth: 200 }}>
								<Text size='xs' tt='uppercase' fw={700} c='dimmed' mb={2}>
									Continue learning
								</Text>
								<Title order={4} mb={2}>
									{lastOpened.name}
								</Title>
								<Text size='sm' c='dimmed'>
									{genCourseOrPaperName(
										lastOpened.subject as Subject,
										lastOpened.board as ExamBoard,
										null,
										(lastOpened.examLevel as ExamLevel | undefined) ?? null
									)}
								</Text>
							</Box>
							<Button component={Link} href={lastOpened.resumeUrl} size={mobileScreen ? 'sm' : 'md'}>
								Resume
							</Button>
						</Group>
					</Card>
				)}

			{recentPapers.length > 0 && (
				<Box mb='md' data-cy='recent-papers-strip'>
					<Title order={4} fw={600} mb='xs'>
						Recently viewed
					</Title>
					<ScrollArea type='scroll' offsetScrollbars scrollbarSize={4}>
						<Group wrap='nowrap' gap='sm' pb='xs'>
							{recentPapers.map(p => (
								<Card
									key={p.paperId}
									component={Link}
									href={p.resumeUrl}
									shadow='sm'
									radius='md'
									p='sm'
									withBorder
									maw={220}
									style={{ flex: '0 0 auto' }}
								>
									<Text fw={600} size='sm' lineClamp={2} mb={2}>
										{p.name}
									</Text>
									<Text size='xs' c='dimmed' lineClamp={1}>
										{genCourseOrPaperName(
											p.subject as Subject,
											p.board as ExamBoard,
											null,
											(p.examLevel as ExamLevel | undefined) ?? null
										)}
									</Text>
								</Card>
							))}
						</Group>
					</ScrollArea>
				</Box>
			)}

			<Card shadow='sm' radius='md' mb='sm' p='md' withBorder>
				<Group justify='space-between' align='center' wrap='wrap' gap='sm'>
					<Title order={3} fw={600}>
						Courses 📚
					</Title>
					<Link href={PATHS.CHOOSE_EXAM_LEVEL}>
						<Button size={mobileScreen ? 'sm' : 'md'}>
							<Text>Add Course</Text>
						</Button>
					</Link>
				</Group>
			</Card>
			<ScrollArea.Autosize mah={coursesScrollHeight}>
				{!courses || isLoading ? (
					<Box h={coursesScrollHeight}>
						<LoadingOverlay visible={isLoading} />
					</Box>
				) : (
					<AnimatedList>
						{courses.map(course => (
							<motion.div
								key={course.course_id}
								whileHover={reduceMotion ? undefined : { y: -2 }}
								whileTap={reduceMotion ? undefined : { scale: 0.995 }}
								transition={{ type: 'spring', stiffness: 400, damping: 25 }}
							>
								<Card shadow='sm' radius='md' mb='sm'>
									<div className='flex grow flex-col items-center justify-center space-y-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-4'>
										<div className='flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3'>
											<Image
												src={`/static/images/${course.subject}-icon.svg`}
												width={mobileScreen ? 60 : 80}
												height={mobileScreen ? 60 : 80}
												alt=''
											/>
											<div className='flex flex-col items-center space-y-1 sm:items-start'>
												<Title order={mobileScreen ? 4 : 3}>{course.name}</Title>
												<Text size={mobileScreen ? 'sm' : 'md'} fw={500} c='dimmed'>
													Year {course.year_level}
												</Text>
											</div>
										</div>
										<Group justify='right'>
											<Link
												href={`${PATHS.COURSE}/${course.course_id}?subject=${course.subject}&board=${course.exam_board}`}
											>
												<Button size={mobileScreen ? 'sm' : 'md'}>
													<Text fw='normal'>{'Continue →'}</Text>
												</Button>
											</Link>
										</Group>
									</div>
								</Card>
							</motion.div>
						))}
					</AnimatedList>
				)}
			</ScrollArea.Autosize>
			</Page.Body>
		</Page.Container>
	);
}
