/* eslint-disable-next-line */
import { Card, Group, Radio, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

export interface SubjectCardProps {
	subject: string;
	src: string;
}

export function SubjectCard(props: SubjectCardProps) {
	return (
		<Card shadow='sm' radius='xs' withBorder>
			<Stack justify="center" align="center">
				<Image src={props.src} alt="subject-icon" width={150} height={150}/>
				<Group align="center">
					<Text size="xl" weight={600}>A-Level {props.subject}</Text>
					<Radio value={props.subject.toLowerCase()} />
				</Group>
			</Stack>
		</Card>
	);
}

export default SubjectCard;
