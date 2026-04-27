'use client';

import { Accordion, Modal } from '@mantine/core';
import { MarkSchemeHintContent } from './MarkSchemeHintContent';
import type { MarkSchemeItem } from './mark-scheme-hint.utils';

type Props = {
	opened: boolean;
	onClose: () => void;
	order: string[];
	byId: Map<string, MarkSchemeItem>;
};

export function MarkSchemeUnstructuredModal({ opened, onClose, order, byId }: Props) {
	return (
		<Modal opened={opened} onClose={onClose} title='Mark scheme hints' size='lg'>
			<Accordion variant='separated' radius='md'>
				{order.map((qid, i) => {
					const item = byId.get(qid);
					if (!item) return null;
					return (
						<Accordion.Item key={qid} value={qid}>
							<Accordion.Control>Question {i + 1}</Accordion.Control>
							<Accordion.Panel>
								<MarkSchemeHintContent item={item} />
							</Accordion.Panel>
						</Accordion.Item>
					);
				})}
			</Accordion>
		</Modal>
	);
}
