'use client';

import { Box, Button, Card, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PATHS } from '~/utils/constants';
import { useExamLevelSelectionFlag } from '~/hooks/useExamLevelSelectionFlag';
import { api } from '~/trpc/react';
import { useMediaQuery } from '@mantine/hooks';
import Page from '~/layout/Page';
import { useValue } from '@legendapp/state/react';
import { appStore$, type LastOpenedPaper, type RecentPaper } from '~/store/app.store';
import { genCourseOrPaperName } from '~/utils/functions';
import type { ExamBoard, ExamLevel, Subject } from '@exam-genius/shared/utils';
import { AnimatedList } from '~/components/AnimatedList';
import { SubjectIcon } from '~/components/subject-icon';
import { motion, useReducedMotion } from 'motion/react';
import { useCallback } from 'react';
import type { Course } from '@exam-genius/shared/prisma';

const SETUP_STEPS = [
	{ label: 'Level', description: 'A-Level or AS-Level' },
	{ label: 'Subject', description: 'Maths, Physics, Economics...' },
	{ label: 'Board', description: 'AQA, Edexcel, OCR or WJEC' }
] as const;

const UNLOCK_ITEMS = [
	{ title: 'Physics', subject: 'physics', meta: 'WJEC - Unit 4', progress: 'w-28', active: true },
	{ title: 'Economics', subject: 'economics', meta: 'Edexcel - Theme 3', progress: 'w-16', active: false }
] as const;

const LAUNCHPAD_STATS = [
	{ value: '2m', label: 'setup time' },
	{ value: '12', label: 'mark hints' },
	{ value: '1', label: 'paper path' }
] as const;

export default function HomePage() {
	const router = useRouter();
	const { data: courses, isLoading } = api.course.getCourses.useQuery();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const lastOpened = useValue(appStore$.lastOpenedPaper);
	const recentPapers = useValue(appStore$.recentPapers);
	const reduceMotion = useReducedMotion();
	const { enabled: examLevelSelectionEnabled, ready: examLevelFlagReady } = useExamLevelSelectionFlag();

	const goAddCourse = useCallback(() => {
		if (!examLevelFlagReady) return;
		if (!examLevelSelectionEnabled) {
			appStore$.onboarding.examLevel.set('a_level');
			router.push(PATHS.NEW_SUBJECT);
			return;
		}
		router.push(PATHS.CHOOSE_EXAM_LEVEL);
	}, [examLevelFlagReady, examLevelSelectionEnabled, router]);

	const userCourses = courses ?? [];
	const hasCourses = userCourses.length > 0;
	const hasRecentActivity = Boolean(lastOpened) || recentPapers.length > 0;
	const isFirstRun = !isLoading && !hasCourses && !hasRecentActivity;

	return (
		<Page.Container
			data_cy='homepage'
			classNames='min-h-screen bg-[#F7F8FF] text-slate-950 dark:bg-[#080B18] dark:text-slate-100'
			extraClassNames='relative overflow-hidden py-4 sm:py-6'
		>
			<Page.Body classNames='relative z-10 mx-auto flex w-full max-w-7xl grow flex-col gap-6 px-4 sm:px-6'>
				<div className='pointer-events-none absolute right-[-140px] top-[-180px] h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-3xl dark:bg-primary/25' />
				<div className='pointer-events-none absolute bottom-[-180px] left-[-120px] h-96 w-96 rounded-full bg-[#BEFF2D]/25 blur-3xl dark:bg-[#BEFF2D]/10' />

				<LaunchpadHero
					hasCourses={hasCourses}
					isFirstRun={isFirstRun}
					mobileScreen={mobileScreen}
					onAddCourse={goAddCourse}
					isAddCourseLoading={!examLevelFlagReady}
				/>

				{lastOpened && <ResumeLearningCard lastOpened={lastOpened} mobileScreen={mobileScreen} />}
				{recentPapers.length > 0 && <RecentPapersStrip papers={recentPapers} />}

				<CoursesSection
					courses={userCourses}
					isLoading={isLoading}
					mobileScreen={mobileScreen}
					reduceMotion={Boolean(reduceMotion)}
					onAddCourse={goAddCourse}
					isAddCourseLoading={!examLevelFlagReady}
				/>
			</Page.Body>
		</Page.Container>
	);
}

interface LaunchpadHeroProps {
	hasCourses: boolean;
	isFirstRun: boolean;
	isAddCourseLoading: boolean;
	mobileScreen: boolean | undefined;
	onAddCourse: () => void;
}

function LaunchpadHero({ hasCourses, isFirstRun, isAddCourseLoading, mobileScreen, onAddCourse }: LaunchpadHeroProps) {
	return (
		<section className='grid gap-5 lg:grid-cols-[1.45fr_0.9fr] lg:items-stretch'>
			<Card className='relative overflow-hidden rounded-[2rem] border-0 bg-[#030A39] p-6 text-white shadow-2xl shadow-slate-950/20 dark:border dark:border-white/10 dark:bg-[#020617] dark:shadow-black/40 sm:p-8 lg:min-h-[26rem]'>
				<div className='absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/55 blur-2xl' />
				<div className='absolute -bottom-24 left-4 h-64 w-64 rounded-full bg-[#BEFF2D]/25 blur-2xl' />
				<div className='relative grid h-full gap-8 lg:grid-cols-[1fr_16rem] lg:items-center'>
					<div>
						<Text className='mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#BEFF2D]'>
							{hasCourses ? 'Your exam workspace' : 'First action'}
						</Text>
						<Title className='max-w-2xl text-[2.45rem] font-bold leading-[0.95] tracking-[-0.07em] text-white sm:text-6xl'>
							{hasCourses ? 'Keep building momentum.' : 'Build your first predicted paper path.'}
						</Title>
						<Text className='mt-5 max-w-xl text-sm font-medium leading-7 text-slate-300 sm:text-base'>
							{hasCourses
								? 'Jump back into a paper, add another course, or use your recent activity to continue revision without searching.'
								: 'Choose A-Level or AS-Level, pick the subject, then select the exact exam board. We will turn that into a focused course workspace.'}
						</Text>
						<div className='mt-7 flex flex-col gap-3 sm:flex-row'>
							<Button
								size={mobileScreen ? 'md' : 'lg'}
								onClick={onAddCourse}
								loading={isAddCourseLoading}
								disabled={isAddCourseLoading}
								className='h-14 rounded-full bg-[#BEFF2D] px-8 text-sm font-bold text-slate-950 shadow-xl shadow-[#BEFF2D]/20 hover:bg-[#d7ff70]'
							>
								{hasCourses ? 'Add another course' : 'Add your first course'}
							</Button>
							<Button
								component={Link}
								href={PATHS.FAQ}
								variant='subtle'
								size={mobileScreen ? 'md' : 'lg'}
								className='h-14 rounded-full bg-white/10 px-8 text-sm font-semibold text-white hover:bg-white/15'
							>
								View FAQ
							</Button>
						</div>
					</div>

					<SetupPath />
				</div>
			</Card>

			<UnlockPreview isFirstRun={isFirstRun} />
		</section>
	);
}

function SetupPath() {
	return (
		<div className='relative rounded-[1.75rem] bg-white/10 p-5 backdrop-blur'>
			<div className='absolute left-10 top-12 h-[calc(100%-6rem)] w-1 rounded-full bg-white/10' />
			{SETUP_STEPS.map((step, index) => (
				<div key={step.label} className='relative flex gap-4 pb-7 last:pb-0'>
					<div
						className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
							index === 0 ? 'bg-[#BEFF2D] text-slate-950' : 'bg-white/15 text-white'
						}`}
					>
						{index + 1}
					</div>
					<div>
						<Text className='text-sm font-bold text-white'>{step.label}</Text>
						<Text className='mt-1 text-xs font-medium leading-5 text-slate-300'>{step.description}</Text>
					</div>
				</div>
			))}
		</div>
	);
}

function UnlockPreview({ isFirstRun }: { isFirstRun: boolean }) {
	return (
		<Card className='relative overflow-hidden rounded-[2rem] border-0 bg-white/90 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/30'>
			<div className='absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl dark:bg-primary/25' />
			<div className='relative'>
				<Text className='text-xs font-bold uppercase tracking-[0.2em] text-primary'>
					{isFirstRun ? 'What unlocks next' : 'Launchpad preview'}
				</Text>
				<Title className='mt-3 text-2xl font-bold leading-tight tracking-[-0.05em] text-slate-950 dark:text-white'>
					{isFirstRun ? 'See what appears after setup.' : 'Add courses to expand the workspace.'}
				</Title>
				<div className='mt-5 space-y-3'>
					{UNLOCK_ITEMS.map(item => (
						<div
							key={item.title}
							className={`rounded-3xl p-4 ${
								item.active
									? 'bg-[#030A39] text-white shadow-xl shadow-slate-950/15 dark:bg-[#020617] dark:shadow-black/25'
									: 'bg-slate-50 text-slate-950 dark:bg-slate-800/80 dark:text-white'
							}`}
						>
							<div className='flex items-center gap-3'>
								<SubjectIcon
									subject={item.subject}
									wrapperClassName={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full p-2 ${
										item.active ? 'bg-white/10' : 'bg-primary/10 dark:bg-white/10'
									}`}
									imageSize={36}
									imageClassName='h-9 w-9 object-contain'
									fallbackClassName={`flex h-full w-full items-center justify-center rounded-full text-sm font-bold ${
										item.active ? 'bg-primary text-white' : 'bg-[#BEFF2D] text-slate-950'
									}`}
								/>
								<div>
									<Text className='text-sm font-bold'>{item.title}</Text>
									<Text className={`text-[0.7rem] font-semibold ${item.active ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
										{item.meta}
									</Text>
								</div>
							</div>
							<div className={`mt-4 h-2 rounded-full ${item.active ? 'bg-white/10' : 'bg-slate-200 dark:bg-slate-700'}`}>
								<div className={`h-full rounded-full ${item.progress} ${item.active ? 'bg-[#BEFF2D]' : 'bg-primary'}`} />
							</div>
						</div>
					))}
				</div>
				<Text className='mt-5 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400'>
					Courses become living workspaces: predicted paper paths, mock mode, mark hints and review.
				</Text>
			</div>
		</Card>
	);
}

interface ResumeLearningCardProps {
	lastOpened: LastOpenedPaper;
	mobileScreen: boolean | undefined;
}

function ResumeLearningCard({ lastOpened, mobileScreen }: ResumeLearningCardProps) {
	return (
		<Card
			className='rounded-[1.75rem] border border-primary/10 bg-white/90 p-5 shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/25'
			data-cy='resume-learning-card'
		>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<Text className='text-xs font-bold uppercase tracking-[0.18em] text-primary'>Continue learning</Text>
					<Title className='mt-2 text-2xl font-bold tracking-[-0.05em] text-slate-950 dark:text-white'>{lastOpened.name}</Title>
					<Text className='mt-1 text-sm font-medium text-slate-500 dark:text-slate-400'>
						{genCourseOrPaperName(
							lastOpened.subject as Subject,
							lastOpened.board as ExamBoard,
							null,
							(lastOpened.examLevel as ExamLevel | undefined) ?? null
						)}
					</Text>
				</div>
				<Button component={Link} href={lastOpened.resumeUrl} size={mobileScreen ? 'sm' : 'md'} className='rounded-full'>
					Resume
				</Button>
			</div>
		</Card>
	);
}

function RecentPapersStrip({ papers }: { papers: RecentPaper[] }) {
	return (
		<Box data-cy='recent-papers-strip'>
			<div className='mb-3 flex items-center justify-between'>
				<Title className='text-xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white'>Recently viewed</Title>
				<Text className='text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>Last 5 papers</Text>
			</div>
			<ScrollArea type='scroll' offsetScrollbars scrollbarSize={4}>
				<div className='flex gap-3 pb-3'>
					{papers.map(paper => (
						<Card
							key={paper.paperId}
							component={Link}
							href={paper.resumeUrl}
							className='min-w-[15rem] rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/20'
						>
							<Text className='line-clamp-2 text-sm font-bold leading-5 text-slate-950 dark:text-white'>{paper.name}</Text>
							<Text className='mt-2 line-clamp-1 text-xs font-semibold text-slate-500 dark:text-slate-400'>
								{genCourseOrPaperName(
									paper.subject as Subject,
									paper.board as ExamBoard,
									null,
									(paper.examLevel as ExamLevel | undefined) ?? null
								)}
							</Text>
						</Card>
					))}
				</div>
			</ScrollArea>
		</Box>
	);
}

interface CoursesSectionProps {
	courses: Course[];
	isLoading: boolean;
	isAddCourseLoading: boolean;
	mobileScreen: boolean | undefined;
	reduceMotion: boolean;
	onAddCourse: () => void;
}

function CoursesSection({
	courses,
	isLoading,
	isAddCourseLoading,
	mobileScreen,
	reduceMotion,
	onAddCourse
}: CoursesSectionProps) {
	return (
		<section className='rounded-[2rem] bg-white/70 p-4 shadow-xl shadow-slate-950/5 backdrop-blur dark:border dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20 sm:p-5'>
			<div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<Title className='text-2xl font-bold tracking-[-0.05em] text-slate-950 dark:text-white'>Courses</Title>
					<Text className='mt-1 text-sm font-medium text-slate-500 dark:text-slate-400'>
						{courses.length > 0
							? 'Your active exam workspaces live here.'
							: 'Add a course to create your first exam workspace.'}
					</Text>
				</div>
				<Button
					size={mobileScreen ? 'sm' : 'md'}
					onClick={onAddCourse}
					disabled={isAddCourseLoading}
					loading={isAddCourseLoading}
					className='rounded-full'
				>
					{courses.length > 0 ? 'Add Course' : 'Add your first course'}
				</Button>
			</div>

			{isLoading ? (
				<Box className='relative min-h-48 rounded-3xl bg-slate-50 dark:bg-slate-950/60'>
					<LoadingOverlay visible />
				</Box>
			) : courses.length > 0 ? (
				<AnimatedList>
					<div className='grid gap-4 lg:grid-cols-2'>
						{courses.map(course => (
							<CourseCard
								key={course.course_id}
								course={course}
								mobileScreen={mobileScreen}
								reduceMotion={reduceMotion}
							/>
						))}
					</div>
				</AnimatedList>
			) : (
				<EmptyCoursesCard onAddCourse={onAddCourse} isAddCourseLoading={isAddCourseLoading} />
			)}
		</section>
	);
}

interface CourseCardProps {
	course: Course;
	mobileScreen: boolean | undefined;
	reduceMotion: boolean;
}

function CourseCard({ course, mobileScreen, reduceMotion }: CourseCardProps) {
	const href = `${PATHS.COURSE}/${course.course_id}?subject=${course.subject}&board=${course.exam_board}`;
	const courseMeta = genCourseOrPaperName(
		course.subject as Subject,
		course.exam_board as ExamBoard,
		null,
		(course.exam_level as ExamLevel | undefined) ?? null
	);

	return (
		<motion.div
			whileHover={reduceMotion ? undefined : { y: -3 }}
			whileTap={reduceMotion ? undefined : { scale: 0.995 }}
			transition={{ type: 'spring', stiffness: 420, damping: 28 }}
		>
			<Card className='h-full rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-950/5 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20'>
				<div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex items-center gap-4'>
						<SubjectOrb subject={course.subject} />
						<div>
							<Title className='text-xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-2xl'>{course.name}</Title>
							<Text className='mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400'>{courseMeta}</Text>
							<Text className='mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
								Year {course.year_level}
							</Text>
						</div>
					</div>
					<Button component={Link} href={href} size={mobileScreen ? 'sm' : 'md'} className='rounded-full'>
						Continue
					</Button>
				</div>
			</Card>
		</motion.div>
	);
}

function EmptyCoursesCard({
	onAddCourse,
	isAddCourseLoading
}: {
	onAddCourse: () => void;
	isAddCourseLoading: boolean;
}) {
	return (
		<Card className='relative overflow-hidden rounded-[1.75rem] border border-primary/10 bg-[#F8FAFF] p-6 text-center dark:border-white/10 dark:bg-slate-950/70'>
			<div className='absolute left-1/2 top-0 h-32 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-2xl dark:bg-primary/20' />
			<div className='relative mx-auto max-w-xl'>
				<Text className='text-xs font-bold uppercase tracking-[0.2em] text-primary'>No course yet</Text>
				<Title className='mt-3 text-3xl font-bold tracking-[-0.06em] text-slate-950 dark:text-white'>
					This is the expected next step.
				</Title>
				<Text className='mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-slate-500 dark:text-slate-400'>
					Start with one subject and board. ExamGenius will turn it into the workspace where papers, hints and mock
					mode appear.
				</Text>
				<div className='mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row'>
					{LAUNCHPAD_STATS.map(stat => (
						<div key={stat.label} className='w-full rounded-2xl bg-white p-4 shadow-md shadow-slate-950/5 dark:bg-slate-900 sm:w-32'>
							<Text className='text-2xl font-bold tracking-[-0.05em] text-slate-950 dark:text-white'>{stat.value}</Text>
							<Text className='mt-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>{stat.label}</Text>
						</div>
					))}
				</div>
				<Button
					size='md'
					onClick={onAddCourse}
					loading={isAddCourseLoading}
					disabled={isAddCourseLoading}
					className='mt-7 rounded-full'
				>
					Add your first course
				</Button>
			</div>
		</Card>
	);
}

function SubjectOrb({ subject }: { subject: string }) {
	return (
		<SubjectIcon
			subject={subject}
			wrapperClassName='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-primary/10 p-2 shadow-lg shadow-primary/20 dark:bg-white/10'
			imageSize={56}
			imageClassName='h-14 w-14 object-contain'
			fallbackClassName='flex h-full w-full items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white'
		/>
	);
}
