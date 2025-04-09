import React, { useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../../layout/Page';
import { Button, Card, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { PATHS } from '~/utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { genCourseOrPaperName } from '~/utils/functions';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import { SUBJECT_PAPERS } from '@exam-genius/shared/utils';

export interface PageQuery extends ParsedUrlQuery {
	course_id: string;
	subject: string;
	board: string;
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
	const mobileScreen = useMediaQuery('(max-width: 30em)');

	const course_info = useMemo(() => {
		if (course) {
			const info = SUBJECT_PAPERS[course.subject][course.exam_board];
			return Object.entries(info);
		} else {
			return [];
		}
	}, [course]);

	return !course ? (
		<LoadingOverlay visible={isLoading} overlayOpacity={0} />
	) : (
		<Page.Container data_cy='subject-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				<header className='flex items-center justify-between mb-6'>
					<div>
						<Title order={mobileScreen ? 3 : 2} weight={600}>
							{genCourseOrPaperName(course.subject, course.exam_board)} 📚
						</Title>
					</div>
					<div className='flex'>
						<Button leftIcon={<IconArrowLeft />} size={mobileScreen ? 'sm' : 'md'} variant='outline' onClick={() => router.replace(PATHS.HOME)}>
							Back
						</Button>
					</div>
				</header>
                {/*@ts-ignore */}
				<ScrollArea.Autosize mah={height - 100}>
					{course_info.map(([unit_name, unit]) => (
						<Card shadow='sm' radius='md' mb='lg' key={unit_name}>
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6">
								<div className='flex flex-col grow items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6'>
									<Image src={unit.icon} width={100} height={100} alt='maths-icon' />
									<div className='flex flex-col space-y-4'>
										<Title order={1} size={mobileScreen ? 'h4' : 'h2'} weight={600}>
											{unit.label}
										</Title>
										{unit.papers.map((paper, index) => (
											<Text key={index} size={mobileScreen ? 'md' : 'xl'} weight={500}>
												{paper.name}
											</Text>
										))}
									</div>
								</div>
								<div className="flex flex-row grow-0 flex-end justify-center sm:justify-end right-0 pt-4 sm:pt-0">
									<Link
										href={`${PATHS.COURSE}/${course.course_id}/${unit_name}?subject=${query.subject}&board=${query.board}`}
									>
										<Button size={mobileScreen ? 'sm' : 'lg'}>
											<Text weight='normal'>{'Get Papers'}</Text>
										</Button>
									</Link>
								</div>
							</div>
						</Card>
					))}
				</ScrollArea.Autosize>
			</Page.Body>
		</Page.Container>
	);
};
export default Course;
