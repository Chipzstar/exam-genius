import { Card, Group, Radio, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import { formatExamLevelForDisplay } from '@exam-genius/shared/utils';
import classes from './subject-card.module.css';

/* eslint-disable-next-line */
export interface SubjectCardProps {
	subject: string;
	src: string;
	/** Display prefix before subject name; default matches shared `formatExamLevelForDisplay('a_level')`. */
	subjectTitlePrefix?: string;
}

export function SubjectCard(props: SubjectCardProps) {
	const prefix = props.subjectTitlePrefix ?? formatExamLevelForDisplay('a_level');
	return (
		<Card component='label' shadow='sm' radius='xs' withBorder className={classes.card}>
			<Stack justify='center' align='center'>
				<Image src={props.src} alt='subject-icon' width={150} height={150} />
				<Group align='center'>
					<Text size='xl' fw={600}>
						{prefix} {props.subject}
					</Text>
					<Radio value={props.subject.toLowerCase()} />
				</Group>
			</Stack>
		</Card>
	);
}

export default SubjectCard;
