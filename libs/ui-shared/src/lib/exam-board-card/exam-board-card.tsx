/* eslint-disable-next-line */
import { Card, Group, Radio, Stack } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

export interface ExamBoardCardProps {
	src: string;
	value: string;
}
export function ExamBoardCard (props: ExamBoardCardProps) {
	return (
		<Card shadow='sm' radius='xs' withBorder mah={400}>
			<Stack justify='center' align='center'>
				<Image src={props.src} alt='subject-icon' width={300} height={300} />
			</Stack>
			<Group position='right'>
				<Radio value={props.value} />
			</Group>
		</Card>
	);
};

export default ExamBoardCard;
