import React from 'react';
import { Card, Stack } from '@mantine/core';
import Image from 'next/image';

const ExamBoardCard = ({ src }: { src: string }) => {
	return (
		<Card shadow='sm' radius='xs' withBorder mah={400}>
			<Stack justify='center' align='center'>
				<Image src={src} alt='subject-icon' width={300} height={300} />
			</Stack>
		</Card>
	);
};

export default ExamBoardCard;
