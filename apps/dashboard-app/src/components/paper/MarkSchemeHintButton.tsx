'use client';

import { ActionIcon, Drawer, Popover, ScrollArea } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconBulb } from '@tabler/icons-react';
import { MarkSchemeHintContent } from './MarkSchemeHintContent';
import type { MarkSchemeItem } from './mark-scheme-hint.utils';

type Props = {
	item: MarkSchemeItem;
	questionLabel?: string | null;
};

export function MarkSchemeHintButton({ item, questionLabel }: Props) {
	const mobile = useMediaQuery('(max-width: 30em)');
	const [drawerOpen, { close: closeDrawer, open: openDrawer }] = useDisclosure(false);

	const heading =
		questionLabel && questionLabel.trim() ? `${questionLabel}` : 'Marking hints';

	if (mobile) {
		return (
			<>
				<ActionIcon
					variant='light'
					color='blue'
					size='sm'
					aria-label={`Open marking hints for question${questionLabel ? ` ${questionLabel}` : ''}`}
					onClick={openDrawer}
				>
					<IconBulb size={16} />
				</ActionIcon>
				<Drawer
					opened={drawerOpen}
					onClose={closeDrawer}
					position='bottom'
					size='85%'
					title={heading}
					styles={{ body: { paddingTop: 8 } }}
				>
					<ScrollArea.Autosize mah='70dvh' type='auto'>
						<MarkSchemeHintContent item={item} />
					</ScrollArea.Autosize>
				</Drawer>
			</>
		);
	}

	return (
		<Popover width={400} position='bottom-start' shadow='md' closeOnClickOutside withArrow>
			<Popover.Target>
				<ActionIcon
					variant='light'
					color='blue'
					size='sm'
					aria-label={`Open marking hints for question${questionLabel ? ` ${questionLabel}` : ''}`}
				>
					<IconBulb size={16} />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown p={0}>
				<ScrollArea.Autosize mah={400} type='auto'>
					<MarkSchemeHintContent item={item} heading={heading} />
				</ScrollArea.Autosize>
			</Popover.Dropdown>
		</Popover>
	);
}
