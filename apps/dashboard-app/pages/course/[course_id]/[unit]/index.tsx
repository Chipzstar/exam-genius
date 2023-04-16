import React, { useCallback, useEffect, useMemo } from 'react';
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
import { capitalize, genCourseOrPaperName, sanitize } from '../../../../utils/functions';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { trpc } from '../../../../utils/trpc';
import { ExamBoard, PaperInfo, Subject } from '../../../../utils/types';
import { useViewportSize } from '@mantine/hooks';
import { TRPCError } from '@trpc/server';

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
	const router = useRouter();
	const { height } = useViewportSize();
	const { isLoading, data: course } = trpc.course.getSingleCourse.useQuery({ id: query.course_id });
	const { data: papers } = trpc.paper.getCoursePapers.useQuery({ courseId: query.course_id });
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

	const generatePaper = useCallback(async (paper: PaperInfo) => {
		try {
			if (papers && papers.length) {
				await openCheckoutSession(paper)
			} else {
				await createPastPaper({
					paper_name: paper.name,
					course_id: query.course_id,
                    subject: query.subject,
					exam_board: query.board,
                    unit_name: query.unit,
					num_questions: paper.num_questions,
					num_marks: paper.marks
				})
				void router.push(`${PATHS.COURSE}/${query.course_id}/${query.unit}/${paper.href}?subject=${query.subject}&board=${query.board}`)
			}
		} catch (err) {
			console.error(err);
			throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: err.message});
		}
	}, [query, papers])

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
				num_questions: paper.num_questions,
				marks: paper.marks
			});
			if (checkout_url) {
				void router.push(checkout_url);
			}
		},
		[course]
	);

	useEffect(() => {console.log(papers)}, [papers]);

	return !course_info ? (
		<LoadingOverlay visible={isLoading} />
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
							<Button leftIcon={<IconArrowLeft />} size='md' variant='outline' onClick={() => router.replace(`${PATHS.COURSE}/${query.course_id}?subject=${query.subject}&board=${query.board}`)}>
								Back
							</Button>
						</div>
					</header>
					<ScrollArea.Autosize mah={height - 150} mt="lg">
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
											href={`${PATHS.COURSE}/${query.course_id}/${query.unit}/${paper.href}?subject=${query.subject}&board=${query.board}`}
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
												onClick={() => generatePaper(paper)}
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
