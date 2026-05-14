'use client';

import { Button, Group, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import React, { useLayoutEffect } from 'react';
import Page from '~/layout/Page';
import { SubjectCard } from '@exam-genius/shared/ui';
import { PATHS } from '~/utils/constants';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import LinkButton from '~/components/LinkButton';
import { useValue } from '@legendapp/state/react';
import { appStore$ } from '~/store/app.store';
import { useExamLevelSelectionFlag } from '~/hooks/useExamLevelSelectionFlag';
import { useRouter } from 'next/navigation';
import { formatExamLevelForDisplay } from '@exam-genius/shared/utils';

export default function ChooseSubjectPage() {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const subject = useValue(appStore$.onboarding.subject);
	const rawExamLevel = useValue(appStore$.onboarding.examLevel);
	const subjectPrefix =
		rawExamLevel === 'as_level' ? formatExamLevelForDisplay('as_level') : formatExamLevelForDisplay('a_level');
	const router = useRouter();
	const { enabled: levelChoiceEnabled, ready: flagReady } = useExamLevelSelectionFlag();

	useLayoutEffect(() => {
		appStore$.onboarding.subject.set('');
		if (!flagReady) return;
		if (levelChoiceEnabled && !appStore$.onboarding.examLevel.peek()) {
			router.replace(PATHS.CHOOSE_EXAM_LEVEL);
		}
	}, [flagReady, levelChoiceEnabled, router]);

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
						<SubjectCard subjectTitlePrefix={subjectPrefix} subject='Maths' src='/static/images/maths-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectPrefix} subject='Biology' src='/static/images/biology-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectPrefix} subject='Chemistry' src='/static/images/chemistry-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectPrefix} subject='Economics' src='/static/images/economics-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectPrefix} subject='Physics' src='/static/images/physics-icon.svg' />
						<SubjectCard subjectTitlePrefix={subjectPrefix} subject='Psychology' src='/static/images/psychology-icon.svg' />
					</SimpleGrid>
				</Radio.Group>
				<Group justify='space-between' pt='lg'>
					<Button
						variant='outline'
						size={mobileScreen ? 'lg' : 'xl'}
						leftSection={<IconArrowLeft size={18} />}
						onClick={() => router.push(levelChoiceEnabled ? PATHS.CHOOSE_EXAM_LEVEL : PATHS.HOME)}
					>
						<Text>Previous</Text>
					</Button>
					<LinkButton href={PATHS.EXAM_BOARD} disabled={!subject} width={140} size={mobileScreen ? 'lg' : 'xl'} text='Next' />
				</Group>
			</Page.Body>
		</Page.Container>
	);
}
