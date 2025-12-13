'use client';

import Link from 'next/link';
import { Button, Title, Text, createStyles, rem, Group } from '@mantine/core';
import { PATHS } from '~/utils/constants';
import Page from '~/layout/Page';

const useStyles = createStyles(theme => ({
	label: {
		textAlign: 'center',
		fontWeight: 900,
		fontSize: rem(220),
		lineHeight: 1,
		marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
		color: theme.colors.brand[5],
		[theme.fn.smallerThan('sm')]: {
			fontSize: rem(120)
		}
	},
	title: {
		fontFamily: `${theme.fontFamily}`,
		textAlign: 'center',
		fontWeight: 900,
		fontSize: rem(38),
		[theme.fn.smallerThan('sm')]: {
			fontSize: rem(32)
		}
	},
	description: {
		maxWidth: rem(500),
		margin: 'auto',
		marginTop: theme.spacing.xl,
		marginBottom: `calc(${theme.spacing.xl} * 1.5)`
	}
}));

export default function NotFound() {
	const { classes } = useStyles();
	return (
		<Page.Container extraClassNames='flex flex-col justify-center items-center'>
			<div className={classes.label}>404</div>
			<Title className={classes.title}>You have found a secret place.</Title>
			<Text color='dimmed' size='lg' align='center' className={classes.description}>
				Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to
				another URL.
			</Text>
			<Group position='center'>
				<Link href={PATHS.HOME}>
					<Button variant='subtle' size='md'>
						Take me back to home page
					</Button>
				</Link>
			</Group>
		</Page.Container>
	);
}

