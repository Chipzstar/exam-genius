import React, { useCallback, useMemo, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../../../layout/Page';
import {
	Anchor,
	Box,
	Breadcrumbs,
	Button,
	Card,
	Group,
	LoadingOverlay,
	ScrollArea,
	Stack,
	Text,
	Title
} from '@mantine/core';
import Image from 'next/image';
import { CHECKOUT_TYPE, PAPER_PRICE_IDS, PATHS, SUBJECT_PAPERS } from '../../../../utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { capitalize, genCourseOrPaperName, notifyError, sanitize } from '../../../../utils/functions';
import Link from 'next/link';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { trpc } from '../../../../utils/trpc';
import { ExamBoard, PaperInfo, Subject } from '../../../../utils/types';
import { useViewportSize } from '@mantine/hooks';
import { TRPCError } from '@trpc/server';
import CustomLoader from '../../../../components/CustomLoader';

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
	const [generating, setGenerating] = useState<boolean>(false);
	const [loading, setLoading] = useState<number | null>(null);
	const router = useRouter();
	const { height } = useViewportSize();
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
					await createPastPaper({
						paper_name: paper.name,
						paper_code: paper.code,
						course_id: query.course_id,
						subject: query.subject,
						exam_board: query.board,
						unit_name: query.unit,
						num_questions: paper.num_questions,
						num_marks: paper.marks
					});
					setLoading(null);
					void router
						.push(
							`${PATHS.COURSE}/${query.course_id}/${query.unit}/${paper.href}?subject=${query.subject}&board=${query.board}&code=${paper.code}`
						)
						.then(() => setGenerating(false));
				}
			} catch (err) {
				console.error(err);
				setGenerating(false)
				notifyError("generate-paper-failed", err.message, <IconX size={20}/>);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
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

	return !course_info ? (
		<LoadingOverlay visible={isLoading} />
	) : generating ? (
		<div className='h-full flex items-center justify-center'>
			<CustomLoader
				text='Generating Paper'
				subText='Approx waiting time is 20 to 60 seconds. Go grab a coffee while we get your paper ready '
			/>
		</div>
	) : (
		<Page.Container data_cy='course-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				<Breadcrumbs mb='lg'>{items}</Breadcrumbs>
				<form method='POST' action='/api/stripe/checkout?mode=payment'>
					<input name='type' id='type' value={CHECKOUT_TYPE.PAPER} hidden />
					<input name='price_id' id='price-id' value={PAPER_PRICE_IDS[query.subject]} hidden />
					<input name='exam_board' id='exam-board' value={course?.exam_board} hidden />
					<input name='subject' id='subject' value={course?.subject} hidden />
					<input name='unit' id='unit' value={query.unit} hidden />
					<input name='course_id' id='course-id' value={query.course_id} hidden />
					<header className='flex items-center justify-between'>
						<Title order={2} weight={600}>
							{course_info.label} 📚
						</Title>
						<div className='flex'>
							<Button
								leftIcon={<IconArrowLeft />}
								size='md'
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
								<Group grow align='center' p='xl' position='apart'>
									<div className='flex grow items-center space-x-8'>
										<Image
											src='/static/images/example-paper.svg'
											width={125}
											height={160}
											alt='example-paper'
										/>
										<div className='flex flex-col'>
											<Title order={1} size='h2' weight={500}>
												{paper.name}
											</Title>
										</div>
									</div>
									<Stack align='end'>
										<Link
											href={`${PATHS.COURSE}/${query.course_id}/${query.unit}/${paper.href}?subject=${query.subject}&board=${query.board}&code=${paper.code}`}
										>
											<Box w={200}>
												<Button type='button' fullWidth size='lg'>
													<Text weight='normal'>View Papers</Text>
												</Button>
											</Box>
										</Link>
										<Box w={200}>
											<Button
												type='button'
												fullWidth
												size='lg'
												onClick={() => {
													setLoading(index);
													generatePaper(paper);
												}}
												loading={loading === index}
											>
												<Text weight='normal'>Generate New</Text>
											</Button>
										</Box>
									</Stack>
								</Group>
							</Card>
						))}
					</ScrollArea.Autosize>
				</form>
			</Page.Body>
		</Page.Container>
	);
};
export default Papers;
