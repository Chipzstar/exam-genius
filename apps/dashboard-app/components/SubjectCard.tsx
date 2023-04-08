import React from 'react';
import { Card, Stack, Text } from '@mantine/core';
import Image from 'next/image';

interface Props {
	subject: string;
	src: string;
}

const SubjectCard = ({subject, src} : Props) => {
	return (
		<Card shadow='sm' radius='xs' withBorder>
			<Stack justify="center" align="center">
				<Image src={src} alt="subject-icon" width={150} height={150}/>
				<Text size="xl" weight={600}>A-Level {subject}</Text>
			</Stack>
		</Card>
	);
};

export default SubjectCard;
