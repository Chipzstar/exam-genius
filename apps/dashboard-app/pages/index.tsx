import Page from '../layout/Page';
import { Button, Card, Divider, Group, ScrollArea, Text, Title } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { PATHS } from '../utils/constants';
import { trpc } from '../utils/trpc';
import { useViewportSize } from '@mantine/hooks';

export function Home() {
	const { height } = useViewportSize();
	const { data: courses } = trpc.course.getCourses.useQuery();

	return (
		<Page.Container data_cy='homepage' extraClassNames='flex flex-col py-6 overflow-y-hidden'>
			<Page.Body>
				<Title order={2} weight={600} mb='lg'>
					Courses 📚
				</Title>
				<ScrollArea.Autosize mah={height - 200}>
					{courses?.map((course, index) => (
						<Card key={index} shadow='sm' radius='md' mb='lg'>
							<Group grow align='center' p='xl' position='apart'>
								<Group>
									<Image
										src={`/static/images/${course.subject}-icon.svg`}
										width={100}
										height={100}
										alt='maths-icon'
									/>
									<div className='flex flex-col space-y-2'>
										<Title order={2}>{course.name}</Title>
										<Text size='xl' weight={500}>
											Year {course.year_level}
										</Text>
									</div>
								</Group>
								<Group position='right'>
									<Link
										href={`${PATHS.COURSE}/${course.course_id}?subject=${course.subject}&board=${course.exam_board}`}
										passHref
									>
										<Button size='lg'>
											<Text weight='normal'>{'Continue →'}</Text>
										</Button>
									</Link>
								</Group>
							</Group>
						</Card>
					))}
				</ScrollArea.Autosize>
				<Divider my='lg' />
				<div className='flex justify-end '>
					<Link href={PATHS.NEW_SUBJECT} passHref>
						<Button size='lg'>
							<Text>{'Add Course'}</Text>
						</Button>
					</Link>
				</div>
			</Page.Body>
		</Page.Container>
	);
}

export default Home;
