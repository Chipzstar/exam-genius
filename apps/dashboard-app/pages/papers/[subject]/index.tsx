import React, { useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../../layout/Page';
import { Button, Card, Group, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { PATHS, SUBJECT_PAPERS } from '../../../utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { capitalize } from '../../../utils/functions';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ExamBoard, Subject } from '../../../utils/types';

export interface PageQuery extends ParsedUrlQuery {
	board: ExamBoard;
	subject: Subject;
}

export const getServerSideProps: GetServerSideProps<{ query: PageQuery }> = async context => {
	const query = context.query as PageQuery;
	return {
		props: {
			query
		}
	};
};

const Course = ({ query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const papers = useMemo(() => {
		if (query?.subject && query?.board) {
			const paper = SUBJECT_PAPERS[query.subject][query.board];
			console.log(paper)
			return Object.entries(paper);
		} else {
			return [];
		}
	}, [query]);

	return (
		<Page.Container data_cy='subject-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				<header className='flex items-center justify-between'>
					<div>
						<Title order={2} weight={600}>
							{capitalize(query.board)} {capitalize(query.subject)} 📚
						</Title>
					</div>
					<div className='flex'>
						<Button leftIcon={<IconArrowLeft />} size="md" variant="outline" onClick={router.back}>
							Back
						</Button>
					</div>
				</header>
				{papers.map(([id, course]) => (
					<Card shadow='sm' radius='md' my='lg' key={id}>
						<Group grow align='center' p='xl' position='apart'>
							<Group spacing='xl'>
								<Image src={course.icon} width={100} height={100} alt='maths-icon' />
								<div className='flex flex-col space-y-4'>
									<Title order={1} size='h2' weight={500}>
										{course.label}
									</Title>
									{course.modules.map((module, index) => (
										<Text key={index} size='xl' weight={700}>
											{module}
										</Text>
									))}
								</div>
							</Group>
							<Group position='right'>
								<Link href={`${PATHS.PAPERS}/${query.subject}/${id}?board=${query.board}`}>
									<Button size='lg'>
										<Text weight='normal'>{'Get Papers'}</Text>
									</Button>
								</Link>
							</Group>
						</Group>
					</Card>
				))}
			</Page.Body>
		</Page.Container>
	);
};
export default Course;
