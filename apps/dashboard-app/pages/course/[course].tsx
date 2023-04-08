import React, { useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../layout/Page';
import { Button, Card, Group, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { SUBJECT_PAPERS } from '../../utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { capitalize } from '../../utils/functions';

export interface PageQuery extends ParsedUrlQuery {
	board: string;
	course: string;
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

	const papers = useMemo(() => {
		return query?.course ? SUBJECT_PAPERS[query.course] : [];
	}, [query]);

	return (
		<Page.Container data_cy='homepage' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				<Title order={2} weight={600} mb='lg'>
					{capitalize(query.board)} {capitalize(query.course)} 📚
				</Title>
				{papers.map(paper => (
					<Card shadow='sm' radius='md' mb="xl">
						<Group grow align='center' p='xl' position='apart'>
							<Group spacing="xl">
								<Image src={paper.icon} width={100} height={100} alt='maths-icon' />
								<div className='flex flex-col space-y-4'>
									<Title order={1} size="h2" weight={500}>{paper.label}</Title>
									{paper.modules.map(module => <Text size="xl" weight={700}>{module}</Text>)}
								</div>
							</Group>
							<div>
								<Button size='lg'>
									<Text weight="normal">{'Get Papers'}</Text>
								</Button>
							</div>
						</Group>
					</Card>
				))}
			</Page.Body>
		</Page.Container>
	);
};
export default Course;
