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

	return (
		<Page.Container data_cy='course-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				{!mobileScreen && <Breadcrumbs mb='lg'>{items}</Breadcrumbs>}
				<header className='flex items-center justify-between'>
					<Title order={mobileScreen ? 3 : 2} fw={600}>
						{course_info.label} 📚
					</Title>
					<div className='flex'>
						<Button
							leftSection={<IconArrowLeft />}
							size={mobileScreen ? 'sm' : 'md'}
							variant='outline'
							onClick={() =>
								router.replace(
									`${PATHS.COURSE}/${resolvedParams.course_id}?subject=${subject}&board=${board}`
								)
							}
						>
							Back
						</Button>
					</div>
				</header>
				<ScrollArea.Autosize mah={height - 150} mt='lg'>
					{flags.paperReferences ? (
						<Accordion mb='lg' variant='separated'>
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
					) : null}
					<AnimatedList>
						{course_info.papers.map((paper, index) => (
							<motion.div
								key={paper.code}
								whileHover={reduceMotion ? undefined : { y: -3 }}
								whileTap={reduceMotion ? undefined : { scale: 0.995 }}
								transition={{ type: 'spring', stiffness: 400, damping: 25 }}
							>
								<Card shadow='sm' radius='md' mb='lg'>
									<div className='flex flex-col items-center space-y-4 p-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-8'>
										<div className='flex grow items-center space-x-8'>
											<Image
												src='/static/images/example-paper.svg'
												width={mobileScreen ? 100 : 125}
												height={mobileScreen ? 128 : 160}
												alt=''
											/>
											<div className='flex flex-col'>
												<Title order={1} size={mobileScreen ? 'h4' : 'h2'} fw={500}>
													{paper.name}
												</Title>
											</div>
										</div>
										<div className='flex grow flex-row items-center justify-between space-x-6 sm:flex-col sm:items-end sm:justify-center sm:space-y-4 sm:space-x-0'>
											<Link
												href={`${PATHS.COURSE}/${resolvedParams.course_id}/${resolvedParams.unit}/${paper.href}?subject=${subject}&board=${board}&code=${paper.code}`}
											>
												<Button
													type='button'
													w={mobileScreen ? 120 : 200}
													size={mobileScreen ? 'xs' : 'lg'}
												>
													<Text fw='normal'>View Papers</Text>
												</Button>
											</Link>
											<Button
												type='button'
												w={mobileScreen ? 120 : 200}
												size={mobileScreen ? 'xs' : 'lg'}
												onClick={() => {
													if (papersLoading) return;
													setLoading(index);
													generatePaper(paper);
												}}
												loading={loading === index}
												disabled={papersLoading || generating}
											>
												<Text fw='normal'>Generate New</Text>
											</Button>
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</AnimatedList>
				</ScrollArea.Autosize>
			</Page.Body>
		</Page.Container>
	);
}

