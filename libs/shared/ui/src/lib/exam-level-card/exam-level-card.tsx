import { Card, Group, Radio, Stack } from '@mantine/core';
import Image from 'next/image';
import classes from './exam-level-card.module.css';

/* eslint-disable-next-line */
export interface ExamLevelCardProps {
	/** Submitted Radio value, e.g. "a_level" or "as_level". */
	value: string;
	/** Path to the icon (served from /static/images/...). */
	src: string;
	/** Accessible alt text for the icon. */
	alt?: string;
}

export function ExamLevelCard(props: ExamLevelCardProps) {
	return (
		<Card component='label' shadow='sm' radius='xs' withBorder mah={400} className={classes.card}>
			<Stack justify='center' align='center'>
				<Image src={props.src} alt={props.alt ?? 'exam-level-icon'} width={300} height={300} />
			</Stack>
			<Group justify='right'>
				<Radio value={props.value} />
			</Group>
		</Card>
	);
}

export default ExamLevelCard;
