'use client';

import React, { use, useCallback, useMemo, useState } from 'react';
import Page from '~/layout/Page';
import {
	Accordion,
	Anchor,
	Breadcrumbs,
	Button,
	Card,
	LoadingOverlay,
	MultiSelect,
	ScrollArea,
	Text,
	Title
} from '@mantine/core';
import Image from 'next/image';
import { CHECKOUT_TYPE, PATHS } from '~/utils/constants';
import { capitalize, genCourseOrPaperName, notifyError, notifySuccess, sanitize } from '~/utils/functions';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { api } from '~/trpc/react';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import CustomLoader from '~/components/CustomLoader';
import { ExamBoard, PaperInfo, Subject, getSubjectPapersCatalog } from '@exam-genius/shared/utils';
import NotFound from '~/app/not-found';
import { AnimatedList } from '~/components/AnimatedList';
import { SubjectIcon } from '~/components/subject-icon';
import { motion, useReducedMotion } from 'motion/react';
import { useValue } from '@legendapp/state/react';
import { appStore$ } from '~/store/app.store';

export default function PapersPage({ params }: { params: Promise<{ course_id: string; unit: string }> }) {
	const resolvedParams = use(params);
	const [content, setContent] = useState<string>('');
	const [generating, setGenerating] = useState<boolean>(false);
	const [loading, setLoading] = useState<number | null>(null);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const subject = (searchParams.get('subject') ?? '') as Subject;
	const board = (searchParams.get('board') ?? '') as ExamBoard;
	const { height } = useViewportSize();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const reduceMotion = useReducedMotion();
	const { isLoading, data: course } = api.course.getSingleCourse.useQuery({ id: resolvedParams.course_id });
	const {
		data: course_papers = [],
		isLoading: papersLoading
	} = api.paper.getPapersByCourse.useQuery({ courseId: resolvedParams.course_id });
	const { mutateAsync: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation();
	const { mutateAsync: createPastPaper } = api.paper.createPaper.useMutation();
	const { mutateAsync: triggerBackendGenerate } = api.paper.triggerBackendGenerate.useMutation();
	const utils = api.useUtils();
	const flags = useValue(appStore$.flags);
	const [referenceIds, setReferenceIds] = useState<string[]>([]);
	const { data: referenceList = [] } = api.reference.list.useQuery(
		{ courseId: resolvedParams.course_id },
		{ enabled: flags.paperReferences }
	);
	const items = [
		{ title: 'Courses', href: PATHS.HOME },
		{
			title: genCourseOrPaperName(course?.subject ?? subject, course?.exam_board ?? board, null, course?.exam_level ?? null),
			href: `${PATHS.COURSE}/${resolvedParams.course_id}?subject=${subject}&board=${board}`
		},
		{
			title: capitalize(sanitize(resolvedParams.unit)),
			href: `${PATHS.COURSE}/${resolvedParams.course_id}/${resolvedParams.unit}?subject=${subject}&board=${board}`
		}
	].map((item, index) => {
		const isActive = pathname === item.href;
		return (
			<Anchor href={item.href} key={index} fw={isActive ? 'bold' : 'normal'}>
				{item.title}
			</Anchor>
		);
	});

	const course_info = useMemo(() => {
		if (!course?.subject || !course?.exam_board) return null;
		const level = course.exam_level ?? 'a_level';
		const catalog = getSubjectPapersCatalog(level);
		return catalog[course.subject][course.exam_board][resolvedParams.unit] ?? null;
	}, [course, resolvedParams.unit]);

	const openCheckoutSession = useCallback(
		async (paper: PaperInfo) => {
			const { checkout_url } = await createCheckoutSession({
				type: CHECKOUT_TYPE.PAPER,
				subject: course?.subject ?? subject,
				exam_board: course?.exam_board ?? board,
				course_id: resolvedParams.course_id,
				unit: resolvedParams.unit,
				paper_href: paper.href,
				paper_name: paper.name,
				paper_code: paper.code,
				num_questions: paper.num_questions,
				marks: paper.marks
			});
			if (checkout_url) {
				router.push(checkout_url);
			}
		},
		[course, subject, board, resolvedParams, createCheckoutSession, router]
	);

	const generatePaper = useCallback(
		async (paper: PaperInfo) => {
			if (papersLoading) {
				return;
			}
			try {
				const num_papers = course_papers.filter(p => p.paper_code === paper.code).length;
				if (num_papers > 0) {
					await openCheckoutSession(paper);
					setLoading(null);
				} else {
					setGenerating(true);
					try {
						const hints = await utils.paper.getGenerationHints.fetch({
							courseId: resolvedParams.course_id,
							paperCode: paper.code
						});
						const hintText = [hints.avoid, hints.exemplars].filter(Boolean).join('\n\n');
						setContent(
							hintText ||
								'Approx waiting time is 30 seconds to 2 minutes. Go grab a coffee while we get your paper ready'
						);
					} catch {
						setContent(
							'Approx waiting time is 30 seconds to 2 minutes. Go grab a coffee while we get your paper ready'
						);
					}
					const created_paper = await createPastPaper({
						paper_name: paper.name,
						paper_code: paper.code,
						course_id: resolvedParams.course_id,
						subject: subject,
						exam_board: board,
						unit_name: resolvedParams.unit,
						num_questions: paper.num_questions,
						num_marks: paper.marks
					});
					await triggerBackendGenerate({
						paperId: created_paper.paper_id,
						num_questions: paper.num_questions,
						num_marks: paper.marks,
						referenceIds: flags.paperReferences && referenceIds.length ? referenceIds : undefined
					});
					notifySuccess(
						'paper-generation-success',
						`${created_paper.exam_board} ${created_paper.subject} has now been generated!!`,
						<IconCheck size={20} />
					);
					setLoading(null);
					router.push(
						`${PATHS.COURSE}/${resolvedParams.course_id}/${resolvedParams.unit}/${paper.href}?subject=${subject}&board=${board}&code=${paper.code}`
					);
					setGenerating(false);
				}
			} catch (err: any) {
				console.error(err);
				setGenerating(false);
				notifyError('generate-paper-failed', err.message, <IconX size={20} />);
			}
		},
		[
			resolvedParams,
			course_papers,
			subject,
			board,
			router,
			createPastPaper,
			openCheckoutSession,
			papersLoading,
			triggerBackendGenerate,
			utils,
			flags.paperReferences,
			referenceIds
		]
	);

	if (isLoading) {
		return <LoadingOverlay visible={isLoading} />;
	}

	if (!course_info) {
		return <NotFound />;
	}

	if (generating) {
		return (
			<div className='flex h-full items-center justify-center'>
				<CustomLoader
					text='Generating Paper'
					subText={content}
				/>
			</div>
		);
	}

	const courseSubject = course?.subject ?? subject;
	const courseBoard = course?.exam_board ?? board;
	const courseTitle = genCourseOrPaperName(courseSubject, courseBoard, null, course?.exam_level ?? null);
	const unitLabel = course_info.label;
	const totalMarks = course_info.papers.reduce((total, paper) => total + paper.marks, 0);

	return (
		<Page.Container
			data_cy='course-page'
			classNames='min-h-screen bg-[#F7F8FF] text-slate-950 dark:bg-[#080B18] dark:text-slate-100'
			extraClassNames='relative overflow-hidden py-4 sm:py-6'
		>
			<Page.Body classNames='relative z-10 mx-auto flex w-full max-w-7xl grow flex-col gap-6 px-4 sm:px-6'>
				<div className='pointer-events-none absolute right-[-140px] top-[-180px] h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-3xl dark:bg-primary/25' />
				<div className='pointer-events-none absolute bottom-[-180px] left-[-120px] h-96 w-96 rounded-full bg-[#BEFF2D]/20 blur-3xl dark:bg-[#BEFF2D]/10' />

				{!mobileScreen && (
					<Breadcrumbs className='relative text-sm font-semibold'>
						{items}
					</Breadcrumbs>
				)}

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
									{courseTitle}
								</Text>
								<Title className='max-w-3xl text-3xl font-bold leading-[0.98] tracking-[-0.06em] text-white sm:text-5xl'>
									{unitLabel}
								</Title>
								<Text className='mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base'>
									View generated variants or create a fresh predicted paper for this unit.
								</Text>
							</div>
						</div>
						<div className='flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end'>
							<Button
								leftSection={<IconArrowLeft />}
								size={mobileScreen ? 'sm' : 'md'}
								variant='subtle'
								onClick={() =>
									router.replace(
										`${PATHS.COURSE}/${resolvedParams.course_id}?subject=${courseSubject}&board=${courseBoard}`
									)
								}
								className='rounded-full bg-white/10 px-6 text-white hover:bg-white/15'
							>
								Back
							</Button>
							<div className='rounded-3xl bg-white/10 px-5 py-4 backdrop-blur'>
								<Text className='text-xs font-bold uppercase tracking-[0.18em] text-slate-300'>Unit bank</Text>
								<Text className='mt-1 text-2xl font-bold text-white'>
									{course_info.papers.length} {course_info.papers.length === 1 ? 'paper' : 'papers'}
								</Text>
								<Text className='mt-1 text-xs font-semibold text-[#BEFF2D]'>{totalMarks} total marks</Text>
							</div>
						</div>
					</div>
				</header>

				<ScrollArea.Autosize mah={height - 180}>
					{flags.paperReferences ? (
						<Card className='mb-5 rounded-[1.75rem] border-0 bg-white/90 p-2 shadow-xl shadow-slate-950/10 backdrop-blur dark:border dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/30'>
							<Accordion variant='separated' classNames={{ item: 'rounded-3xl border-0 dark:bg-slate-800/80' }}>
								<Accordion.Item value='refs'>
									<Accordion.Control>Reference style for next generation</Accordion.Control>
									<Accordion.Panel>
										<Text size='sm' c='dimmed' mb='xs'>
											Optional PDFs uploaded under References. Only &quot;ready&quot; files are used.
										</Text>
										<MultiSelect
											placeholder='Pick references to steer style'
											data={referenceList
												.filter(r => r.status === 'ready')
												.map(r => ({
													value: r.reference_id,
													label: `${r.filename} (${r.kind})`
												}))}
											value={referenceIds}
											onChange={setReferenceIds}
											clearable
											searchable
										/>
									</Accordion.Panel>
								</Accordion.Item>
								<Accordion.Item value='hints'>
									<Accordion.Control>What we learned from your feedback</Accordion.Control>
									<Accordion.Panel>
										<Text size='sm' c='dimmed'>
											When you generate a paper, we show personalized style notes on the loading screen
											(built from your ratings and question feedback for that paper code).
										</Text>
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Card>
					) : null}
					<AnimatedList>
						<div className='grid gap-4'>
							{course_info.papers.map((paper, index) => (
								<motion.div
									key={paper.code}
									whileHover={reduceMotion ? undefined : { y: -3 }}
									whileTap={reduceMotion ? undefined : { scale: 0.995 }}
									transition={{ type: 'spring', stiffness: 400, damping: 25 }}
								>
									<Card className='overflow-hidden rounded-[1.75rem] border-0 bg-white/90 p-5 shadow-xl shadow-slate-950/10 backdrop-blur dark:border dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/30 sm:p-6'>
										<div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
											<div className='flex grow items-center gap-5'>
												<div className='flex h-24 w-20 shrink-0 items-center justify-center rounded-[1.35rem] bg-primary/10 p-3 shadow-lg shadow-primary/10 dark:bg-white/10'>
													<Image
														src='/static/images/example-paper.svg'
														width={mobileScreen ? 72 : 88}
														height={mobileScreen ? 92 : 112}
														alt=''
														className='object-contain'
													/>
												</div>
												<div>
													<Text className='text-xs font-bold uppercase tracking-[0.18em] text-primary'>
														Predicted paper
													</Text>
													<Title className='mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white'>
														{paper.name}
													</Title>
													<div className='mt-4 flex flex-wrap gap-2'>
														<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
															{paper.num_questions} questions
														</span>
														<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
															{paper.marks} marks
														</span>
														<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
															{paper.code}
														</span>
													</div>
												</div>
											</div>
											<div className='flex flex-col gap-3 sm:flex-row lg:flex-col'>
												<Button
													component={Link}
													type='button'
													href={`${PATHS.COURSE}/${resolvedParams.course_id}/${resolvedParams.unit}/${paper.href}?subject=${courseSubject}&board=${courseBoard}&code=${paper.code}`}
													size={mobileScreen ? 'sm' : 'md'}
													className='rounded-full bg-[#BEFF2D] px-8 text-sm font-bold text-slate-950 shadow-lg shadow-[#BEFF2D]/20 hover:bg-[#d7ff70]'
												>
													View Papers
												</Button>
												<Button
													type='button'
													variant='subtle'
													size={mobileScreen ? 'sm' : 'md'}
													onClick={() => {
														if (papersLoading) return;
														setLoading(index);
														generatePaper(paper);
													}}
													loading={loading === index}
													disabled={papersLoading || generating}
													className='rounded-full bg-primary/10 px-8 text-sm font-bold text-primary hover:bg-primary/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15'
												>
													Generate New
												</Button>
											</div>
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

