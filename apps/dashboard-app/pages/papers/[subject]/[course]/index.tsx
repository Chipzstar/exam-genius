import React, { useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../../../layout/Page';
import { Box, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { PATHS, SUBJECT_PAPERS } from '../../../../utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { capitalize } from '../../../../utils/functions';
import Link from 'next/link';
import NotFoundTitle from '../../../404';
import { v4 as uuidv4 } from 'uuid';

export interface PageQuery extends ParsedUrlQuery {
	board: string;
	subject: string;
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

const Papers = ({ query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const course = useMemo(() => {
		if (query?.subject) {
			return SUBJECT_PAPERS[query.subject][query.course];
		} else {
			return null;
		}
	}, [query]);

	return !course ? (
		<NotFoundTitle />
	) : (
		<Page.Container data_cy='course-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				<Title order={2} weight={600} mb='lg'>
					{capitalize(course.label)} 📚
				</Title>
				{course.modules.map(module => (
					<Card shadow='sm' radius='md' my='lg'>
						<Group grow align='center' p='xl' position='apart'>
							<Group spacing='xl'>
								<Image
									src='/static/images/example-paper.svg'
									width={125}
									height={160}
									alt='example-paper'
								/>
								<div className='flex flex-col space-y-4'>
									<Title order={1} size='h2' weight={500}>
										{module}
									</Title>
								</div>
							</Group>
							<Stack>
								<Link href={`${PATHS.VIEW_PAPER}/${uuidv4()}`}>
									<Box w={200}>
										<Button fullWidth size='lg'>
											<Text weight='normal'>View Paper</Text>
										</Button>
									</Box>
								</Link>
								<Box w={200}>
									<Button fullWidth size='lg'>
										<Text weight='normal'>Generate New</Text>
									</Button>
								</Box>
							</Stack>
						</Group>
					</Card>
				))}
			</Page.Body>
		</Page.Container>
	);
};
export default Papers;
