'use client';

import { useState, type CSSProperties } from 'react';
import { Anchor, Box, Group, Text, UnstyledButton, useComputedColorScheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import Link from 'next/link';
import { PATHS } from '~/utils/constants';

export function DisclaimerStrip() {
	const isMobile = useMediaQuery('(max-width: 30em)');
	const [expanded, setExpanded] = useState(false);
	const colorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
	const isDark = colorScheme === 'dark';

	const stripSurface: CSSProperties = {
		position: 'sticky',
		top: 0,
		zIndex: 20,
		borderBottom: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
		backgroundColor: isDark ? 'var(--mantine-color-dark-8)' : 'var(--mantine-color-gray-0)'
	};

	const line =
		'ExamGenius papers are AI-predicted practice content, not official past papers.';

	if (!isMobile) {
		return (
			<Box
				component='aside'
				data-cy='disclaimer-strip'
				className='paper-no-print'
				py='xs'
				px='md'
				style={stripSurface}
			>
				<Group justify='space-between' wrap='nowrap' gap='md'>
					<Text size='sm' c='dimmed' style={{ flex: 1 }}>
						{line}{' '}
						<Anchor component={Link} href={PATHS.FAQ} size='sm' fw={600}>
							Learn more
						</Anchor>
					</Text>
				</Group>
			</Box>
		);
	}

	return (
		<Box
			component='aside'
			data-cy='disclaimer-strip'
			className='paper-no-print'
			px='sm'
			py={expanded ? 'xs' : 4}
			style={stripSurface}
		>
			<Group justify='space-between' wrap='nowrap' gap={4} align='flex-start'>
				<Text size='xs' c='dimmed' lineClamp={expanded ? undefined : 1} style={{ flex: 1 }}>
					{line}{' '}
					{expanded && (
						<Anchor component={Link} href={PATHS.FAQ} size='xs' fw={600}>
							Learn more
						</Anchor>
					)}
				</Text>
				<UnstyledButton
					onClick={() => setExpanded(e => !e)}
					aria-expanded={expanded}
					aria-label={expanded ? 'Collapse disclaimer' : 'Expand disclaimer'}
					p={4}
				>
					{expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
				</UnstyledButton>
			</Group>
			{!expanded && (
				<Text size='xs' mt={4}>
					<Anchor component={Link} href={PATHS.FAQ} fw={600}>
						Learn more
					</Anchor>
				</Text>
			)}
		</Box>
	);
}
