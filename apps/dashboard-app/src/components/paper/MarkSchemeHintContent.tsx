'use client';

import { Badge, Box, Group, Paper, Stack, Text } from '@mantine/core';
import { LatexHtml } from './Latex';
import type { MarkSchemeItem } from './mark-scheme-hint.utils';

type Props = {
	item: MarkSchemeItem;
	heading?: string;
};

export function MarkSchemeHintContent({ item, heading }: Props) {
	const hasModel = Boolean(item.model_answer?.trim());
	const hasPoints = item.points.length > 0;
	if (!hasModel && !hasPoints) {
		return (
			<Stack gap='xs' p='xs'>
				{heading ? (
					<Text size='sm' fw={600}>
						{heading}
					</Text>
				) : null}
				<Text size='sm' c='dimmed'>
					No marking details for this part.
				</Text>
			</Stack>
		);
	}
	return (
		<Stack gap='md' p='xs' maw={480}>
			{heading ? (
				<Text size='sm' fw={600}>
					{heading}
				</Text>
			) : null}
			{hasModel ? (
				<Box>
					<Text size='xs' tt='uppercase' fw={600} c='dimmed' mb={6}>
						Model answer
					</Text>
					<Box
						className='text-sm'
						style={{
							borderLeft: '3px solid var(--mantine-color-blue-filled, var(--mantine-primary-color-filled))',
							paddingLeft: 12
						}}
					>
						<LatexHtml html={item.model_answer ?? ''} />
					</Box>
				</Box>
			) : null}
			{hasPoints ? (
				<Box>
					<Text size='xs' tt='uppercase' fw={600} c='dimmed' mb={6}>
						Marking points
					</Text>
					<Stack gap='xs'>
						{item.points.map((p, i) => (
							<Paper
								key={i}
								withBorder
								p='sm'
								radius='md'
								bg='var(--mantine-color-body)'
							>
								<GroupItem point={p} />
							</Paper>
						))}
					</Stack>
				</Box>
			) : null}
		</Stack>
	);
}

function GroupItem({ point }: { point: { description: string; marks: number } }) {
	return (
		<Group gap='sm' align='flex-start' wrap='nowrap'>
			<Badge size='sm' variant='light' color='blue' style={{ flexShrink: 0 }}>
				{point.marks}m
			</Badge>
			<Text size='sm' style={{ lineHeight: 1.5 }}>
				{point.description}
			</Text>
		</Group>
	);
}
