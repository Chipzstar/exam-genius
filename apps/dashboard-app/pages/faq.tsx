import React from 'react';

import { Accordion, Button, createStyles, rem, Title } from '@mantine/core';
import Page from '../layout/Page';
import { IconArrowLeft } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';

const useStyles = createStyles(theme => ({
	wrapper: {
		paddingTop: `calc(${theme.spacing.xl} * 2)`,
		paddingBottom: `calc(${theme.spacing.xl} * 2)`,
		minHeight: 650
	},

	title: {
		marginBottom: `calc(${theme.spacing.xl} * 1.5)`
	},

	item: {
		borderRadius: theme.radius.md,
		marginBottom: theme.spacing.lg,
		border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`
	}
}));
	const FAQ = () => {
		const { classes } = useStyles();
		const router = useRouter();
		const mobileScreen = useMediaQuery('(max-width: 30em)');
		return (
			<Page.Container>
				<header className='flex items-center justify-between p-6'>
					<Button
						leftIcon={<IconArrowLeft />}
						size={mobileScreen ? 'sm' : 'md'}
						variant='outline'
						onClick={router.back}
					>
						Back
					</Button>
				</header>
				<Page.Body extraClassNames='justify-center items-center'>
					<Title align='center' className={classes.title}>
						Frequently Asked Questions
					</Title>

					<Accordion variant='separated' w={{ base: '100%', sm: 700 }}>
						<Accordion.Item className={classes.item} value='pricing'>
							<Accordion.Control>
								I just generated a paper, but now I have to pay for another one?
							</Accordion.Control>
							<Accordion.Panel>
								After purchasing a course, you get a free predicted paper for each type of paper in the
								course. Each new paper will then cost £5 to generate
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item className={classes.item} value='failure'>
							<Accordion.Control>I tried generating my paper but it keeps failing.</Accordion.Control>
							<Accordion.Panel>
								Please send your issue to <strong>support@email-genius.com</strong> with your login email.
								We will do our best to resolve your issue ASAP.
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item className={classes.item} value='reset-password'>
							<Accordion.Control>How can I reset my password?</Accordion.Control>
							<Accordion.Panel>
								Navigate to the login page. Enter you email. Before entering your password you should see a
								"Forgot Password" link. Click the link and proceed as follows
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item className={classes.item} value='credit-card'>
							<Accordion.Control>Do you store credit card information securely?</Accordion.Control>
							<Accordion.Panel>
								Yes! All payment information is stored securely with high-level encryption
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
				</Page.Body>
			</Page.Container>
		);
	};

	export default FAQ;
