import React, { useCallback, useMemo, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../../../layout/Page';
import { Anchor, Breadcrumbs, Button, Card, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { CHECKOUT_TYPE, PAPER_PRICE_IDS, PATHS } from '../../../../utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { capitalize, genCourseOrPaperName, notifyError, notifySuccess, sanitize } from '../../../../utils/functions';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trpc } from '../../../../utils/trpc';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import CustomLoader from '../../../../components/CustomLoader';
import { ExamBoard, PaperInfo, Subject, SUBJECT_PAPERS } from '@exam-genius/shared/utils';
import NotFound404 from '../../../404';
import axios from 'axios';

export interface PageQuery extends ParsedUrlQuery {
	board: ExamBoard;
	subject: Subject;
	unit: string;
	course_id: string;
}

export const getServerSideProps: GetServerSideProps<{ query: PageQuery }> = async context => {
	const query = context.query as PageQuery;
	return {
		props: {
			query
		}
	};
};

const Papers = ({ query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [content, setContent] = useState<string>('');
	const [generating, setGenerating] = useState<boolean>(false);
	const [loading, setLoading] = useState<number | null>(null);
	const router = useRouter();
	const { height } = useViewportSize();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const { isLoading, data: course } = trpc.course.getSingleCourse.useQuery({ id: query.course_id });
	const { data: course_papers } = trpc.paper.getPapersByCourse.useQuery(
		{ courseId: query.course_id },
		{ initialData: [] }
	);
	const { mutateAsync: createCheckoutSession } = trpc.stripe.createCheckoutSession.useMutation();
	const { mutateAsync: createPastPaper } = trpc.paper.createPaper.useMutation();
	const items = [
		{ title: 'Courses', href: PATHS.HOME },
		{
			title: genCourseOrPaperName(course?.subject ?? query.subject, course?.exam_board ?? query.board),
			href: `${PATHS.COURSE}/${query.course_id}?subject=${query.subject}&board=${query.board}`
		},
		{
			title: capitalize(sanitize(query.unit)),
			href: `${PATHS.COURSE}/${query.course_id}/${query.unit}?subject=${query.subject}&board=${query.board}`
		}
	].map((item, index) => (
		<Anchor href={item.href} key={index} weight={router.pathname === item.href ? 'bold' : 'normal'}>
			{item.title}
		</Anchor>
	));

	const course_info = useMemo(() => {
		return course ? SUBJECT_PAPERS[course.subject][course.exam_board][query.unit] : null;
	}, [course]);

	const generatePaper = useCallback(
		async (paper: PaperInfo) => {
			try {
				// check if the user owns any existing papers with the same paper_code
				const num_papers = course_papers.filter(p => p.paper_code === paper.code).length;
				if (num_papers > 0) {
					await openCheckoutSession(paper);
					setLoading(null);
				} else {
					setGenerating(true);
					// create past paper in backend
					const created_paper = await createPastPaper({
						paper_name: paper.name,
						paper_code: paper.code,
						course_id: query.course_id,
						subject: query.subject,
						exam_board: query.board,
						unit_name: query.unit,
						num_questions: paper.num_questions,
						num_marks: paper.marks
					});
					axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/server/paper/generate`, {
						paper_id: created_paper.paper_id,
                        course_id: created_paper.course_id,
                        subject: created_paper.subject,
                        exam_board: created_paper.exam_board,
                        unit_name: created_paper.unit_name,
                        num_questions: paper.num_questions,
                        num_marks: paper.marks
					}).then(({data}) => {
						notifySuccess('paper-generation-success', `${created_paper.exam_board} ${created_paper.subject} has now been generated!!`, <IconCheck size={20}/>)
					}).catch(error => {
						console.error(error)
					})
					setLoading(null);
					void router
						.push(
							`${PATHS.COURSE}/${query.course_id}/${query.unit}/${paper.href}?subject=${query.subject}&board=${query.board}&code=${paper.code}`
						)
						.then(() => setGenerating(false));
				}
			} catch (err) {
				console.error(err);
				setGenerating(false);
				notifyError('generate-paper-failed', err.message, <IconX size={20} />);
			}
		},
		[query, course_papers]
	);

	const openCheckoutSession = useCallback(
		async (paper: PaperInfo) => {
			const { checkout_url } = await createCheckoutSession({
				type: CHECKOUT_TYPE.PAPER,
				price_id: PAPER_PRICE_IDS[query.subject],
				subject: course?.subject ?? query.subject,
				exam_board: course?.exam_board ?? query.board,
				course_id: query.course_id,
				unit: query.unit,
				paper_href: paper.href,
				paper_name: paper.name,
				paper_code: paper.code,
				num_questions: paper.num_questions,
				marks: paper.marks
			});
			if (checkout_url) {
				void router.push(checkout_url);
			}
		},
		[course]
	);

	return isLoading ? (
		<LoadingOverlay visible={isLoading} />
	) : !course_info ? (
		<NotFound404 />
	) : generating ? (
		<div className='flex h-full items-center justify-center'>
			<CustomLoader
				text='Generating Paper'
				subText={content}
			/>
		</div>
	) : (
		<Page.Container data_cy='course-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				{!mobileScreen && <Breadcrumbs mb='lg'>{items}</Breadcrumbs>}
				<header className='flex items-center justify-between'>
					<Title order={mobileScreen ? 3 : 2} weight={600}>
						{course_info.label} 📚
					</Title>
					<div className='flex'>
						<Button
							leftIcon={<IconArrowLeft />}
							size={mobileScreen ? 'sm' : 'md'}
							variant='outline'
							onClick={() =>
								router.replace(
									`${PATHS.COURSE}/${query.course_id}?subject=${query.subject}&board=${query.board}`
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
										<Title order={1} size={mobileScreen ? 'h4' : 'h2'} weight={500}>
											{paper.name}
										</Title>
									</div>
								</div>
								<div className='flex grow flex-row items-center justify-between space-x-6 sm:flex-col sm:items-end sm:justify-center sm:space-y-4 sm:space-x-0'>
									<Link
										href={`${PATHS.COURSE}/${query.course_id}/${query.unit}/${paper.href}?subject=${query.subject}&board=${query.board}&code=${paper.code}`}
									>
										<Button
											type='button'
											w={mobileScreen ? 120 : 200}
											size={mobileScreen ? 'xs' : 'lg'}
										>
											<Text weight='normal'>View Papers</Text>
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
										<Text weight='normal'>Generate New</Text>
									</Button>
								</div>
							</div>
						</Card>
					))}
				</ScrollArea.Autosize>
			</Page.Body>
		</Page.Container>
	);
};
export default Papers;
