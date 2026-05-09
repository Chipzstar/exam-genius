import React from 'react';
import { Box, Button, Group, Radio, SimpleGrid, Text, Title } from '@mantine/core';
import Page from '../layout/Page';
import { ExamLevelCard } from '@exam-genius/shared/ui';
import { useMediaQuery } from '@mantine/hooks';
import type { ExamLevel } from '@exam-genius/shared/utils';

interface Props {
	next: () => void;
	disabled: boolean;
	value: ExamLevel | '';
	onChange: (value: string) => void;
}

export default function ChooseExamLevel({ next, disabled, value, onChange }: Props) {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	return (
		<Page.Container classNames='h-full flex flex-col pb-2'>
			<header className='pb-20'>
				<Title ta='center' order={2} size='h1' c='brand.5' fw={600}>
					Choose qualification level
				</Title>
			</header>
			<Page.Body extraClassNames='h-full justify-center'>
				<div className='pb-10'>
					<Radio.Group name='exam-level' value={value || ''} onChange={onChange}>
						<SimpleGrid cols={{ base: 1, xs: 2 }}>
							<ExamLevelCard value='a_level' src='/static/images/a-level-icon.jpg' alt='A-Level' />
							<ExamLevelCard value='as_level' src='/static/images/as-level-icon.png' alt='AS-Level' />
						</SimpleGrid>
					</Radio.Group>
					<Group justify='flex-end' pt='xl'>
						<Box w={140}>
							<Button fullWidth size={mobileScreen ? 'lg' : 'xl'} disabled={disabled} onClick={next}>
								<Text>Next</Text>
							</Button>
						</Box>
					</Group>
				</div>
			</Page.Body>
		</Page.Container>
	);
}
