'use client';

import React, { use, useMemo } from 'react';
import Page from '~/layout/Page';
import { Button, Card, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { PATHS } from '~/utils/constants';
import { genCourseOrPaperName } from '~/utils/functions';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import { type CourseInfo, getSubjectPapersCatalog } from '@exam-genius/shared/utils';
import { AnimatedList } from '~/components/AnimatedList';
import { SubjectIcon } from '~/components/subject-icon';
import { motion, useReducedMotion } from 'motion/react';

export default function CoursePage({ params }: { params: Promise<{ course_id: string }> }) {
	const resolvedParams = use(params);
	const { height } = useViewportSize();
	const router = useRouter();
	const searchParams = useSearchParams();
	const subject = searchParams.get('subject') ?? '';
	const board = searchParams.get('board') ?? '';
	const { isLoading, data: course } = api.course.getSingleCourse.useQuery({ id: resolvedParams.course_id });
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const reduceMotion = useReducedMotion();

	const course_info = useMemo(() => {
		if (course?.subject != null && course?.exam_board != null) {
			const catalog = getSubjectPapersCatalog(course.exam_level ?? 'a_level');
			const info = catalog[course.subject][course.exam_board];
			return Object.entries(info) as [string, CourseInfo][];
		}
		return [];
	}, [course]);

	if (isLoading || !course) {
		return <LoadingOverlay visible={isLoading} />;
	}

	const courseSubject = course.subject ?? subject;
	const courseBoard = course.exam_board ?? board;
	const courseTitle = genCourseOrPaperName(
		course.subject,
		course.exam_board,
		null,
		course.exam_level ?? 'a_level'
	);
	const courseLevel = course.exam_level === 'as_level' ? 'AS-Level' : 'A-Level';

	return (
		<Page.Container
			data_cy='subject-page'
			classNames='min-h-screen bg-[#F7F8FF] text-slate-950 dark:bg-[#080B18] dark:text-slate-100'
			extraClassNames='relative overflow-hidden py-4 sm:py-6'
		>
			<Page.Body classNames='relative z-10 mx-auto flex w-full max-w-7xl grow flex-col gap-6 px-4 sm:px-6'>
				<div className='pointer-events-none absolute right-[-140px] top-[-180px] h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-3xl dark:bg-primary/25' />
				<div className='pointer-events-none absolute bottom-[-180px] left-[-120px] h-96 w-96 rounded-full bg-[#BEFF2D]/20 blur-3xl dark:bg-[#BEFF2D]/10' />

				<header className='relative overflow-hidden rounded-[2rem] bg-[#030A39] p-6 text-white shadow-2xl shadow-slate-950/20 dark:border dark:border-white/10 dark:bg-[#020617] dark:shadow-black/40 sm:p-8'>
					<div className='absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/55 blur-2xl' />
					<div className='absolute -bottom-24 left-4 h-64 w-64 rounded-full bg-[#BEFF2D]/20 blur-2xl' />
					<div className='relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
						<div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
							<SubjectIcon
								subject={courseSubject}
								wrapperClassName='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] bg-white/10 p-3 shadow-xl shadow-black/20'
								imageSize={64}
								imageClassName='h-16 w-16 object-contain'
								fallbackClassName='flex h-full w-full items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white'
							/>
							<div>
								<Text className='mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#BEFF2D]'>
									Course launchpad
								</Text>
								<Title className='max-w-3xl text-3xl font-bold leading-[0.98] tracking-[-0.06em] text-white sm:text-5xl'>
									{courseTitle}
								</Title>
								<Text className='mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base'>
									Choose a unit to view predicted papers and generate new practice material for this exam path.
								</Text>
							</div>
						</div>
						<div className='flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end'>
							<Button
								leftSection={<IconArrowLeft />}
								size={mobileScreen ? 'sm' : 'md'}
								variant='subtle'
								onClick={() => router.replace(PATHS.HOME)}
								className='rounded-full bg-white/10 px-6 text-white hover:bg-white/15'
							>
								Back
							</Button>
							<div className='rounded-3xl bg-white/10 px-5 py-4 backdrop-blur'>
								<Text className='text-xs font-bold uppercase tracking-[0.18em] text-slate-300'>Available</Text>
								<Text className='mt-1 text-2xl font-bold text-white'>
									{course_info.length} {course_info.length === 1 ? 'unit' : 'units'}
								</Text>
								<Text className='mt-1 text-xs font-semibold text-[#BEFF2D]'>{courseLevel}</Text>
							</div>
						</div>
					</div>
				</header>

				<ScrollArea.Autosize mah={height - 170}>
					<AnimatedList>
						<div className='grid gap-4 lg:grid-cols-2'>
							{course_info.map(([unit_name, unit]) => (
								<motion.div
									key={unit_name}
									whileHover={reduceMotion ? undefined : { y: -3 }}
									whileTap={reduceMotion ? undefined : { scale: 0.995 }}
									transition={{ type: 'spring', stiffness: 400, damping: 25 }}
								>
									<Card className='h-full overflow-hidden rounded-[1.75rem] border-0 bg-white/90 p-5 shadow-xl shadow-slate-950/10 backdrop-blur dark:border dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/30 sm:p-6'>
										<div className='flex h-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
											<div className='flex grow flex-col gap-5 sm:flex-row sm:items-center'>
												<div className='flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.5rem] bg-primary/10 p-4 dark:bg-white/10'>
													<Image src={unit.icon} width={72} height={72} alt='' className='h-18 w-18 object-contain' />
												</div>
												<div>
													<Title className='text-2xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white'>
														{unit.label}
													</Title>
													<div className='mt-4 flex flex-wrap gap-2'>
														{unit.papers.map(paper => (
															<span
																key={paper.code}
																className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300'
															>
																{paper.name}
															</span>
														))}
													</div>
												</div>
											</div>
											<Button
												component={Link}
												href={`${PATHS.COURSE}/${course.course_id}/${unit_name}?subject=${courseSubject}&board=${courseBoard}`}
												size={mobileScreen ? 'md' : 'lg'}
												className='rounded-full bg-[#BEFF2D] px-8 text-sm font-bold text-slate-950 shadow-lg shadow-[#BEFF2D]/20 hover:bg-[#d7ff70]'
											>
												Get Papers
											</Button>
										</div>
									</Card>
								</motion.div>
							))}
						</div>
					</AnimatedList>
				</ScrollArea.Autosize>
			</Page.Body>
		</Page.Container>
	);
}

