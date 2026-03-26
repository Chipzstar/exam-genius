'use client';

import { Group, Radio, SimpleGrid, Title } from '@mantine/core';
import React, { useLayoutEffect } from 'react';
import Page from '~/layout/Page';
import { SubjectCard } from '@exam-genius/shared/ui';
import { PATHS } from '~/utils/constants';
import { useMediaQuery } from '@mantine/hooks';
import LinkButton from '~/components/LinkButton';
import { useValue } from '@legendapp/state/react';
import { appStore$ } from '~/store/app.store';

export default function ChooseSubjectPage() {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const subject = useValue(appStore$.onboarding.subject);

	useLayoutEffect(() => {
		appStore$.onboarding.subject.set('');
	}, []);

	return (
		<Page.Container extraClassNames='bg-[var(--mantine-color-body)]'>
			<header className='py-6'>
				<Title ta='center' order={2} size={mobileScreen ? 'h2' : 'h1'} c='brand' fw={600}>
					Choose your Subjects
				</Title>
			</header>
			<Page.Body extraClassNames='justify-between py-8'>
				<Radio.Group name='subject' value={subject} onChange={v => appStore$.onboarding.subject.set(v)}>
					<SimpleGrid cols={3}>
						<SubjectCard subject='Maths' src='/static/images/maths-icon.svg' />
						<SubjectCard subject='Biology' src='/static/images/biology-icon.svg' />
						<SubjectCard subject='Chemistry' src='/static/images/chemistry-icon.svg' />
						<SubjectCard subject='Economics' src='/static/images/economics-icon.svg' />
						<SubjectCard subject='Physics' src='/static/images/physics-icon.svg' />
						<SubjectCard subject='Psychology' src='/static/images/psychology-icon.svg' />
					</SimpleGrid>
				</Radio.Group>
				<Group justify='right' pt='lg'>
					<LinkButton href={PATHS.EXAM_BOARD} disabled={!subject} width={140} size={mobileScreen ? 'lg' : 'xl'} text='Next' />
				</Group>
			</Page.Body>
		</Page.Container>
	);
}
