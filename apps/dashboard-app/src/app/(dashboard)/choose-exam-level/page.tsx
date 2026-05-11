'use client';

import { Box, Button, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';
import Page from '~/layout/Page';
import { PATHS } from '~/utils/constants';
import { useMediaQuery } from '@mantine/hooks';
import { useValue } from '@legendapp/state/react';
import { appStore$ } from '~/store/app.store';
import { useExamLevelSelectionFlag } from '~/hooks/useExamLevelSelectionFlag';
import { useRouter } from 'next/navigation';
import { ExamLevelCard } from '@exam-genius/shared/ui';
import type { ExamLevel } from '@exam-genius/shared/utils';

export default function ChooseExamLevelPage() {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const examLevel = useValue(appStore$.onboarding.examLevel);
	const router = useRouter();
	const { ready: flagReady } = useExamLevelSelectionFlag();

	return (
		<Page.Container extraClassNames='bg-[var(--mantine-color-body)]'>
			<header className='py-6'>
				<Title ta='center' order={2} size={mobileScreen ? 'h2' : 'h1'} c='brand' fw={600}>
					Choose qualification level
				</Title>
			</header>
			<Page.Body extraClassNames='justify-center'>
				{!flagReady ? (
					<Text ta='center' c='dimmed'>
						Loading…
					</Text>
				) : (
					<>
						<Radio.Group
							name='exam-level'
							value={examLevel || ''}
							onChange={(v: string) => appStore$.onboarding.examLevel.set(v as ExamLevel)}
						>
							<SimpleGrid cols={2}>
								<ExamLevelCard value='a_level' src='/static/images/a-level-icon.jpg' alt='A-Level' />
								<ExamLevelCard value='as_level' src='/static/images/as-level-icon-2.png' alt='AS-Level' />
							</SimpleGrid>
						</Radio.Group>

						<Box
							w={140}
							style={
								mobileScreen
									? { float: 'right', paddingTop: '2em' }
									: {
											position: 'absolute',
											right: 20,
											bottom: 20
										}
							}
						>
							<Button
								fullWidth
								size={mobileScreen ? 'lg' : 'xl'}
								disabled={!examLevel}
								onClick={() => router.push(PATHS.NEW_SUBJECT)}
							>
								<Text>Next</Text>
							</Button>
						</Box>
					</>
				)}
			</Page.Body>
		</Page.Container>
	);
}
