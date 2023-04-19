import React from 'react';
import Image from 'next/image';
import { Carousel } from '@mantine/carousel';
import { useMantineTheme } from '@mantine/core';
import { reviews } from '../utils/constants';
import ReviewCard from '../components/ReviewCard';
import { useViewportSize } from '@mantine/hooks';

const Reviews = () => {
	const { width } = useViewportSize();
	const theme = useMantineTheme();
	const slides1 = reviews.slice(0, 3).map((review, index) => (
		<Carousel.Slide key={index}>
			<ReviewCard {...review} />
		</Carousel.Slide>
	));
	const slides2 = reviews.slice(3).map((review, index) => (
		<Carousel.Slide key={index}>
			<ReviewCard {...review} />
		</Carousel.Slide>
	));
	return (
		<div className='container flex h-screen flex-col items-center justify-center gap-y-20 py-10'>
			<p className='text-4xl font-medium sm:text-4xl md:text-5xl lg:text-6xl'>
				<span className='inline-block leading-normal'>
					<div className='flex inline-flex shrink flex-col items-center pl-4'>
						Student reviews
						<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={250} />
					</div>
				</span>
			</p>
			<div className='flex flex-col space-y-4'>
				<Carousel
					maw={width}
					height={200}
					slideSize='66.666666%'
					breakpoints={[
						{ maxWidth: 'md', slideSize: '66.66666%' },
						{ maxWidth: 'sm', slideSize: '100%', slideGap: 0 }
					]}
					slideGap='md'
					loop
					align='center'
					styles={{
						control: {
							'&[data-inactive]': {
								opacity: 0,
								cursor: 'default'
							}
						}
					}}
				>
					{slides1}
				</Carousel>
				<Carousel
					maw={width}
					height={200}
					slideSize='66.666666%'
					breakpoints={[
						{ maxWidth: 'md', slideSize: '66.66666%' },
						{ maxWidth: 'sm', slideSize: '100%', slideGap: 0 }
					]}
					slideGap='md'
					loop
					align='center'
					styles={{
						control: {
							'&[data-inactive]': {
								opacity: 0,
								cursor: 'default'
							}
						}
					}}
				>
					{slides2}
				</Carousel>
			</div>
		</div>
	);
};

export default Reviews;
