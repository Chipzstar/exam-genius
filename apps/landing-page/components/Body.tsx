import React from 'react';
import { Image, List, ThemeIcon } from '@mantine/core';
import { IconArrowBigLeft, IconBulb, IconMoodSmile } from '@tabler/icons-react';

export const Body = () => {
	return (
		<div className='flex h-screen items-center py-10'>
			<div className='flex grid grid-cols-1 items-center justify-center gap-20 md:grid-cols-7'>
				<div className='flex flex-col space-y-12 md:col-span-4'>
					<p className='text-4xl font-medium sm:text-4xl md:text-5xl lg:text-6xl'>
						<span className='inline-block leading-normal'>
							Accurate predictions to remove
							<div className='flex inline-flex shrink flex-col items-center pl-4'>
								<span> exam stress</span>
								<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={250} />
							</div>
						</span>
					</p>
					<List
						spacing='lg'
						size='lg'
						center
						icon={
							<ThemeIcon color='brand' size={24} radius='xl'>
								<IconBulb size='1rem' />
							</ThemeIcon>
						}
						styles={{
							item: {
								lineHeight: '2rem'
							}
						}}
					>
						<List.Item>Study smarter with AI predicted papers and focus on what really matters.</List.Item>
						<List.Item
							icon={
								<ThemeIcon color='brand' size={24} radius='xl'>
									<IconArrowBigLeft size='1rem' />
								</ThemeIcon>
							}
						>
							Covering every subject in the AQA, Edexcel, and OCR exam boards.
						</List.Item>
						<List.Item
							icon={
								<ThemeIcon color='brand' size={24} radius='xl'>
									<IconMoodSmile size='1rem' />
								</ThemeIcon>
							}
						>
							Choose your exam board and subject to receive personalised predictions to help you get into
							your first choice University.
						</List.Item>
					</List>
				</div>
				<div className='md:col-span-3'>
					<Image src='/static/images/body.svg' alt='' width='100%' height='100%' />
				</div>
			</div>
		</div>
	);
};

export default Body;
