import Page from '../layout/Page';
import { Button, Card, Group, Text, Title } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { PATHS } from '../utils/constants';

export function Home() {
	return (
		<Page.Container
			data_cy='homepage'
			classNames='flex flex-col'
			header={
				<Page.Header extraClassNames='mb-3 justify-center'>
					<span className='font-medium text-primary text-center text-4xl'>ExamGenius</span>
				</Page.Header>
			}
		>
			<Page.Body>
				<Title order={2} weight={600} mb='lg'>
					Courses 📚
				</Title>
				<Card shadow='sm' radius='xs'>
					<Group grow align='center' p='xl' position='apart'>
						<Group>
							<Image src='/static/images/maths-icon.svg' width={100} height={100} alt='maths-icon' />
							<div className='flex flex-col space-y-4'>
								<Title order={2}>Edexcel Mathematics</Title>
								<Title order={3}>Year 13</Title>
							</div>
						</Group>
						<div>
							<Button size='lg'>
								<Text>{'Continue →'}</Text>
							</Button>
						</div>
					</Group>
				</Card>
				<div className='flex justify-end p-10'>
					<Link href={PATHS.NEW_COURSE} passHref>
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
