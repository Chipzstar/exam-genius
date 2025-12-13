'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Page from '~/layout/Page';
import { Anchor, Breadcrumbs, Button, Card, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { CHECKOUT_TYPE, PAPER_PRICE_IDS, PATHS } from '~/utils/constants';
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

export default function PapersPage({ params }: { params: { course_id: string; unit: string } }) {
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
	const { isLoading, data: course } = api.course.getSingleCourse.useQuery({ id: params.course_id });
	const { data: course_papers } = api.paper.getPapersByCourse.useQuery(
		{ courseId: params.course_id },
		{ initialData: [] }
	);
	const { mutateAsync: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation();
	const { mutateAsync: createPastPaper } = api.paper.createPaper.useMutation();
	const items = [
		{ title: 'Courses', href: PATHS.HOME },
		{
			title: genCourseOrPaperName(course?.subject ?? subject, course?.exam_board ?? board),
			href: `${PATHS.COURSE}/${params.course_id}?subject=${subject}&board=${board}`
		},
		{
			title: capitalize(sanitize(params.unit)),
			href: `${PATHS.COURSE}/${params.course_id}/${params.unit}?subject=${subject}&board=${board}`
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
		return course ? SUBJECT_PAPERS[course.subject][course.exam_board][params.unit] : null;
	}, [course, params.unit]);

	const generatePaper = useCallback(
		async (paper: PaperInfo) => {
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
						course_id: params.course_id,
						subject: subject,
						exam_board: board,
						unit_name: params.unit,
						num_questions: paper.num_questions,
						num_marks: paper.marks
					});
					axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/server/paper/generate`, {
						paper_id: created_paper.paper_id,
						paper_name: created_paper.name,
						subject: created_paper.subject,
						exam_board: created_paper.exam_board,
						course: created_paper.unit_name,
						num_questions: paper.num_questions,
						num_marks: paper.marks
					} as GeneratePaperPayload).then(({data}) => {
						notifySuccess('paper-generation-success', `${created_paper.exam_board} ${created_paper.subject} has now been generated!!`, <IconCheck size={20}/>)
					}).catch(error => {
						console.error(error)
					})
					setLoading(null);
					router.push(
						`${PATHS.COURSE}/${params.course_id}/${params.unit}/${paper.href}?subject=${subject}&board=${board}&code=${paper.code}`
					);
					setGenerating(false);
				}
			} catch (err: any) {
				console.error(err);
				setGenerating(false);
				notifyError('generate-paper-failed', err.message, <IconX size={20} />);
			}
		},
		[params, course_papers, subject, board, router]
	);

	const openCheckoutSession = useCallback(
		async (paper: PaperInfo) => {
			const { checkout_url } = await createCheckoutSession({
				type: CHECKOUT_TYPE.PAPER,
				price_id: PAPER_PRICE_IDS[subject],
				subject: course?.subject ?? subject,
				exam_board: course?.exam_board ?? board,
				course_id: params.course_id,
				unit: params.unit,
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
		[course, subject, board, params, createCheckoutSession, router]
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
									`${PATHS.COURSE}/${params.course_id}?subject=${subject}&board=${board}`
								)
							}
						>
							Back
						</Button>
					</div>
				</header>
				<ScrollArea.Autosize mah={height - 150} mt='lg'>
					{course_info.papers.map((paper, index) => (
						<Card shadow='sm' radius='md' mb='lg' key={index}>
							<div className='flex flex-col items-center space-y-4 p-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-8'>
								<div className='flex grow items-center space-x-8'>
									<Image
										src='/static/images/example-paper.svg'
										width={mobileScreen ? 100 : 125}
										height={mobileScreen ? 128 : 160}
										alt='example-paper'
									/>
									<div className='flex flex-col'>
										<Title order={1} size={mobileScreen ? 'h4' : 'h2'} fw={500}>
											{paper.name}
										</Title>
									</div>
								</div>
								<div className='flex grow flex-row items-center justify-between space-x-6 sm:flex-col sm:items-end sm:justify-center sm:space-y-4 sm:space-x-0'>
									<Link
										href={`${PATHS.COURSE}/${params.course_id}/${params.unit}/${paper.href}?subject=${subject}&board=${board}&code=${paper.code}`}
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
											setLoading(index);
											generatePaper(paper);
										}}
										loading={loading === index}
									>
										<Text fw='normal'>Generate New</Text>
									</Button>
								</div>
							</div>
						</Card>
					))}
				</ScrollArea.Autosize>
			</Page.Body>
		</Page.Container>
	);
}

