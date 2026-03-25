'use client';

import {
	Box,
	Button,
	Card,
	Divider,
	Group,
	LoadingOverlay,
	ScrollArea,
	Text,
	Title
} from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { PATHS } from '~/utils/constants';
import { api } from '~/trpc/react';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import Page from '~/layout/Page';
import { useValue } from '@legendapp/state/react';
import { appStore$ } from '~/store/app.store';
import { genCourseOrPaperName } from '~/utils/functions';
import type { ExamBoard, Subject } from '@exam-genius/shared/utils';
import { AnimatedList } from '~/components/AnimatedList';
import { motion, useReducedMotion } from 'motion/react';

export default function HomePage() {
	const { height } = useViewportSize();
	const { data: courses, isLoading } = api.course.getCourses.useQuery();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const lastOpened = useValue(appStore$.lastOpenedPaper);
	const recentPapers = useValue(appStore$.recentPapers);
	const reduceMotion = useReducedMotion();

	return (
		<Page.Container data_cy='homepage' extraClassNames='flex flex-col py-6 overflow-y-hidden'>
			<Page.Body>
				{lastOpened && (
					<Card
						shadow='sm'
						radius='md'
						mb='xl'
						p='lg'
						withBorder
						data-cy='resume-learning-card'
					>
						<Group justify='space-between' align='flex-start' wrap='wrap' gap='md'>
							<Box style={{ flex: 1, minWidth: 200 }}>
								<Text size='xs' tt='uppercase' fw={700} c='dimmed' mb={4}>
									Continue learning
								</Text>
								<Title order={3} mb={4}>
									{lastOpened.name}
								</Title>
								<Text size='sm' c='dimmed'>
									{genCourseOrPaperName(lastOpened.subject as Subject, lastOpened.board as ExamBoard)}
								</Text>
							</Box>
							<Button component={Link} href={lastOpened.resumeUrl} size={mobileScreen ? 'md' : 'lg'}>
								Resume
							</Button>
						</Group>
					</Card>
				)}

				{recentPapers.length > 0 && (
					<Box mb='xl' data-cy='recent-papers-strip'>
						<Title order={3} fw={600} mb='sm'>
							Recently viewed
						</Title>
						<ScrollArea type='scroll' offsetScrollbars scrollbarSize={6}>
							<Group wrap='nowrap' gap='md' pb='xs'>
								{recentPapers.map(p => (
									<Card
										key={p.paperId}
										component={Link}
										href={p.resumeUrl}
										shadow='sm'
										radius='md'
										p='md'
										withBorder
										maw={280}
										style={{ flex: '0 0 auto' }}
									>
										<Text fw={600} lineClamp={2} mb={4}>
											{p.name}
										</Text>
										<Text size='xs' c='dimmed' lineClamp={1}>
											{genCourseOrPaperName(p.subject as Subject, p.board as ExamBoard)}
										</Text>
									</Card>
								))}
							</Group>
						</ScrollArea>
					</Box>
				)}

				<Title order={2} fw={600} mb='lg'>
					Courses 📚
				</Title>
				<ScrollArea.Autosize mah={height - 200}>
					{!courses || isLoading ? (
						<Box h={height - 200}>
							<LoadingOverlay visible={isLoading} />
						</Box>
					) : (
						<AnimatedList>
							{courses.map(course => (
								<motion.div
									key={course.course_id}
									whileHover={reduceMotion ? undefined : { y: -3 }}
									whileTap={reduceMotion ? undefined : { scale: 0.995 }}
									transition={{ type: 'spring', stiffness: 400, damping: 25 }}
								>
									<Card shadow='sm' radius='md' mb='lg'>
										<div className='flex grow flex-col items-center justify-center space-y-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-6'>
											<div className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
												<Image
													src={`/static/images/${course.subject}-icon.svg`}
													width={mobileScreen ? 75 : 100}
													height={mobileScreen ? 75 : 100}
													alt=''
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
								</motion.div>
							))}
						</AnimatedList>
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
