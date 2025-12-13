'use client';

import Link from 'next/link';
import { Button, Title, Text, Group } from '@mantine/core';
import { PATHS } from '~/utils/constants';
import Page from '~/layout/Page';
import classes from './not-found.module.css';

export default function NotFound() {
	return (
		<Page.Container extraClassNames='flex flex-col justify-center items-center'>
			<div className={classes.label}>404</div>
			<Title className={classes.title}>You have found a secret place.</Title>
			<Text c='dimmed' size='lg' ta='center' className={classes.description}>
				Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to
				another URL.
			</Text>
			<Group justify='center'>
				<Link href={PATHS.HOME}>
					<Button variant='subtle' size='md'>
						Take me back to home page
					</Button>
				</Link>
			</Group>
		</Page.Container>
	);
}

