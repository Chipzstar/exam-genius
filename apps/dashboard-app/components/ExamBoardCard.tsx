import React from 'react';
import { Card, Group, Radio, Stack } from '@mantine/core';
import Image from 'next/image';

interface Props {
	src: string;
	value: string;
}

const ExamBoardCard = ({ src, value }: Props) => {
	return (
		<Card shadow='sm' radius='xs' withBorder mah={400}>
			<Stack justify='center' align='center'>
				<Image src={src} alt='subject-icon' width={300} height={300} />
			</Stack>
			<Group position='right'>
				<Radio value={value} />
			</Group>
		</Card>
	);
};

export default ExamBoardCard;
