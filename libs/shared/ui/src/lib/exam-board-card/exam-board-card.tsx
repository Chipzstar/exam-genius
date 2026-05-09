import { Card, Group, Radio, Stack } from '@mantine/core';
import Image from 'next/image';
import classes from './exam-board-card.module.css';

/* eslint-disable-next-line */
export interface ExamBoardCardProps {
	src: string;
	value: string;
}

export function ExamBoardCard(props: ExamBoardCardProps) {
	return (
		<Card component='label' shadow='sm' radius='xs' withBorder mah={400} className={classes.card}>
			<Stack justify='center' align='center'>
				<Image src={props.src} alt='subject-icon' width={300} height={300} />
			</Stack>
			<Group justify='right'>
				<Radio value={props.value} />
			</Group>
		</Card>
	);
}

export default ExamBoardCard;
