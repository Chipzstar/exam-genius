'use client';

import React from 'react';
import { Accordion, Button, Title } from '@mantine/core';
import Page from '~/layout/Page';
import { IconArrowLeft } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

export default function FAQPage() {
	const router = useRouter();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	return (
		<Page.Container>
			<header className='flex items-center justify-between p-6'>
				<Button
					leftSection={<IconArrowLeft />}
					size={mobileScreen ? 'sm' : 'md'}
					variant='outline'
					onClick={() => router.back()}
				>
					Back
				</Button>
			</header>
			<Page.Body extraClassNames='justify-center items-center'>
				<Title order={2} mb={{ base: 'md', sm: 'xl' }}>
					Frequently Asked Questions
				</Title>

				<Accordion 
					variant='separated' 
					w={{ base: '100%', sm: 700 }}
					styles={{
						item: {
							borderRadius: 'var(--mantine-radius-md)',
							marginBottom: 'var(--mantine-spacing-lg)',
							border: '1px solid var(--mantine-color-gray-3)'
						}
					}}
				>
					<Accordion.Item value='pricing'>
						<Accordion.Control>
							I just generated a paper, but now I have to pay for another one?
						</Accordion.Control>
						<Accordion.Panel>
							After purchasing a course, you get a free predicted paper for each type of paper in the
							course. Each new paper will then cost £5 to generate
						</Accordion.Panel>
					</Accordion.Item>

					<Accordion.Item value='failure'>
						<Accordion.Control>I tried generating my paper but it keeps failing.</Accordion.Control>
						<Accordion.Panel>
							Please send your issue to <strong>support@exam-genius.com</strong> with your login email.
							We will do our best to resolve your issue ASAP.
						</Accordion.Panel>
					</Accordion.Item>

					<Accordion.Item value='reset-password'>
						<Accordion.Control>How can I reset my password?</Accordion.Control>
						<Accordion.Panel>
							Navigate to the login page. Enter you email. Before entering your password you should see a
							{"Forgot Password"} link. Click the link and proceed as follows
						</Accordion.Panel>
					</Accordion.Item>

					<Accordion.Item value='credit-card'>
						<Accordion.Control>Do you store credit card information securely?</Accordion.Control>
						<Accordion.Panel>
							Yes! All payment information is stored securely with high-level encryption
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Page.Body>
		</Page.Container>
	);
}

