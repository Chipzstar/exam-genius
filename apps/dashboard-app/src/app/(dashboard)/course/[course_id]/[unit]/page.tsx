'use client';

import React, { use, useCallback, useMemo, useState } from 'react';
import Page from '~/layout/Page';
import { Anchor, Breadcrumbs, Button, Card, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { CHECKOUT_TYPE, PATHS } from '~/utils/constants';
import { capitalize, genCourseOrPaperName, notifyError, notifySuccess, sanitize } from '~/utils/functions';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { api } from '~/trpc/react';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import CustomLoader from '~/components/CustomLoader';
import { ExamBoard, PaperInfo, Subject, SUBJECT_PAPERS } from '@exam-genius/shared/utils';
import NotFound from '~/app/not-found';
import axios from 'axios';
import { GeneratePaperPayload } from '~/utils/types';
import { env } from '~/env';
import { AnimatedList } from '~/components/AnimatedList';
import { motion, useReducedMotion } from 'motion/react';

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
	const items = [
		{ title: 'Courses', href: PATHS.HOME },
		{
			title: genCourseOrPaperName(course?.subject ?? subject, course?.exam_board ?? board),
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
		return course ? SUBJECT_PAPERS[course.subject][course.exam_board][resolvedParams.unit] : null;
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
					axios
						.post(`${env.NEXT_PUBLIC_BACKEND_HOST}/server/paper/generate`, {
							paper_id: created_paper.paper_id,
							paper_name: created_paper.name,
							subject: created_paper.subject,
							exam_board: created_paper.exam_board,
							course: created_paper.unit_name,
							num_questions: paper.num_questions,
							num_marks: paper.marks
						} as GeneratePaperPayload)
						.then(({ data }) => {
							notifySuccess(
								'paper-generation-success',
								`${created_paper.exam_board} ${created_paper.subject} has now been generated!!`,
								<IconCheck size={20} />
							);
						})
						.catch(error => {
							console.error(error);
						});
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
		[resolvedParams, course_papers, subject, board, router, createPastPaper, openCheckoutSession, papersLoading]
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

