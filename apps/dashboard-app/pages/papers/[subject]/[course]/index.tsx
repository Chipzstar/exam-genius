import React, { useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';
import Page from '../../../../layout/Page';
import { Anchor, Box, Breadcrumbs, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { PAPER_PRICE_IDS, PATHS, SUBJECT_PAPERS } from '../../../../utils/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { capitalize } from '../../../../utils/functions';
import Link from 'next/link';
import NotFoundTitle from '../../../404';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';

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
	const router = useRouter();
	const items = [
		{ title: 'Courses', href: PATHS.HOME },
		{
			title: `${capitalize(query.board)} - ${capitalize(query.subject)}`,
			href: `${PATHS.PAPERS}/${query.subject}?board=${query.board}`
		},
		{ title: 'Papers', href: `${PATHS.PAPERS}/${query.subject}/${query.course}?board=${query.board}`}
	].map((item, index) => (
		<Anchor href={item.href} key={index} weight={router.pathname === item.href ? 'bold' : 'normal'}>
			{item.title}
		</Anchor>
	));

	const course = useMemo(() => {
		if (query?.subject) {
			return SUBJECT_PAPERS[query.subject][query.board][query.course];
		} else {
			return null;
		}
	}, [query]);

	return !course ? (
		<NotFoundTitle />
	) : (
		<Page.Container data_cy='course-page' extraClassNames='flex flex-col py-6'>
			<Page.Body>
				<Breadcrumbs mb='lg'>{items}</Breadcrumbs>
				<form method='POST' action='/api/stripe/checkout?mode=payment'>
					<input name='price_id' id='price-id' value={PAPER_PRICE_IDS[query?.subject]} hidden />
					<header className='flex items-center justify-between'>
						<Title order={2} weight={600}>
							{capitalize(course.label)} 📚
						</Title>
						<div className='flex'>
							<Button leftIcon={<IconArrowLeft />} size='md' variant='outline' onClick={router.back}>
								Back
							</Button>
						</div>
					</header>
					{course.modules.map((module, index) => (
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
											{module}
										</Title>
									</div>
								</div>
								<Stack align='end'>
									<Link href={`${PATHS.VIEW_PAPER}/paper_aJ$L7TkWdG5Wv9i89`}>
										<Box w={200}>
											<Button type='button' fullWidth size='lg'>
												<Text weight='normal'>View Paper</Text>
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
