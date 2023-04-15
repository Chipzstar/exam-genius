import React, { useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../../../layout/Page';
import { Anchor, Box, Breadcrumbs, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { CHECKOUT_TYPE, PAPER_PRICE_IDS, PATHS, SUBJECT_PAPERS } from '../../../../utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { capitalize, genCourseOrPaperName } from '../../../../utils/functions';
import Link from 'next/link';
import NotFoundTitle from '../../../404';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { trpc } from '../../../../utils/trpc';
import { ExamBoard, Subject } from '../../../../utils/types';

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
	const { data: course } = trpc.course.getSingleCourse.useQuery({id: query.course_id});
	const { data : papers } = trpc.paper.getCoursePapers.useQuery({courseId: query.course_id});
	const items = [
		{ title: 'Courses', href: PATHS.HOME },
		{
			title: genCourseOrPaperName(query.subject, query.board),
			href: `${PATHS.COURSE}/${query.course_id}?subject=${query.subject}&board=${query.board}`
		},
		{ title: capitalize(query.unit), href: `${PATHS.COURSE}/${query.course_id}/${query.unit}?subject=${query.subject}&board=${query.board}`}
	].map((item, index) => (
		<Anchor href={item.href} key={index} weight={router.pathname === item.href ? 'bold' : 'normal'}>
			{item.title}
		</Anchor>
	));

	const course_info = useMemo(() => {
		return course ? SUBJECT_PAPERS[course.subject][course.exam_board][query.unit] : null;
	}, [course]);

	return !course_info ? (
		<NotFoundTitle />
	) : (
		<Page.Container data_cy='course-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				<Breadcrumbs mb='lg'>{items}</Breadcrumbs>
				<form method='POST' action='/api/stripe/checkout?mode=payment'>
					<input name="type" id="type" value={CHECKOUT_TYPE.PAPER} hidden/>
					<input name='price_id' id='price-id' value={PAPER_PRICE_IDS[query.subject]} hidden />
					<input name="exam_board" id="exam-board" value={query.board} hidden/>
					<input name="subject" id="subject" value={query.subject} hidden/>
					<input name="unit" id="unit" value={query.unit} hidden/>
					<input name="course_id" id="course-id" value={query.course_id} hidden/>
					<header className='flex items-center justify-between'>
						<Title order={2} weight={600}>
							{capitalize(course_info.label)} 📚
						</Title>
						<div className='flex'>
							<Button leftIcon={<IconArrowLeft />} size='md' variant='outline' onClick={router.back}>
								Back
							</Button>
						</div>
					</header>
					{course_info.papers.map((paper, index) => (
						<Card shadow='sm' radius='md' my='lg' key={index}>
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
											{paper}
										</Title>
									</div>
								</div>
								<Stack align='end'>
									<Link href={`${PATHS.COURSE}/${query.course_id}/${query.unit}/${paper}?subject=${query.subject}&board=${query.board}`}>
										<Box w={200}>
											<Button type='button' fullWidth size='lg'>
												<Text weight='normal'>View Papers</Text>
											</Button>
										</Box>
									</Link>
									<Box w={200}>
										<Button type='submit' fullWidth size='lg'>
											<Text weight='normal'>Generate New</Text>
										</Button>
									</Box>
								</Stack>
							</Group>
						</Card>
					))}
				</form>
			</Page.Body>
		</Page.Container>
	);
};
export default Papers;
