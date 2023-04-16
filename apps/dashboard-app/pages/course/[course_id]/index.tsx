import React, { useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../../layout/Page';
import { Button, Card, Group, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { PATHS, SUBJECT_PAPERS } from '../../../utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { capitalize } from '../../../utils/functions';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import { useViewportSize } from '@mantine/hooks';

export interface PageQuery extends ParsedUrlQuery {
	course_id: string;
}

export const getServerSideProps: GetServerSideProps<{ query: PageQuery }> = async context => {
	const query = context.query as PageQuery;
	console.log(query);
	return {
		props: {
			query
		}
	};
};

const Course = ({ query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { height } = useViewportSize();
	const router = useRouter();
	const { isLoading, data: course } = trpc.course.getSingleCourse.useQuery({ id: query.course_id });

	const course_info = useMemo(() => {
		if (course) {
			const info = SUBJECT_PAPERS[course.subject][course.exam_board];
			return Object.entries(info);
		} else {
			return [];
		}
	}, [course]);

	return !course ? (
		<LoadingOverlay visible={isLoading} />
	) : (
		<Page.Container data_cy='subject-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				<header className='flex items-center justify-between'>
					<div>
						<Title order={2} weight={600}>
							{capitalize(course.exam_board)} {capitalize(course.subject)} 📚
						</Title>
					</div>
					<div className='flex'>
						<Button leftIcon={<IconArrowLeft />} size='md' variant='outline' onClick={router.back}>
							Back
						</Button>
					</div>
				</header>
				<ScrollArea.Autosize mah={height - 100}>
					{course_info.map(([unit_name, unit]) => (
						<Card shadow='sm' radius='md' my='lg' key={unit_name}>
							<Group align='center' p='xl' position='apart'>
								<div className="flex items-center grow space-x-6">
									<Image src={unit.icon} width={100} height={100} alt='maths-icon' />
									<div className='flex flex-col space-y-4'>
										<Title order={1} size='h2' weight={500}>
											{unit.label}
										</Title>
										{unit.papers.map((paper, index) => (
											<Text key={index} size='xl' weight={700}>
												{paper.name}
											</Text>
										))}
									</div>
								</div>
								<div className="shrink grow-0 flex-end justify-end right-0">
									<Link
										href={`${PATHS.COURSE}/${course.course_id}/${unit_name}?subject=${query.subject}&board=${query.board}`}
									>
										<Button size='lg'>
											<Text weight='normal'>{'Get Papers'}</Text>
										</Button>
									</Link>
								</div>
							</Group>
						</Card>
					))}
				</ScrollArea.Autosize>
			</Page.Body>
		</Page.Container>
	);
};
export default Course;
