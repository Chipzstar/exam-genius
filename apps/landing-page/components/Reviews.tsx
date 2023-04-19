import React from 'react';
import Image from 'next/image';
import { Carousel } from '@mantine/carousel';
import { reviews } from '../utils/constants';
import ReviewCard from './ReviewCard';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';

const Reviews = () => {
	const { width } = useViewportSize();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
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
		<div id='reviews' className='flex h-screen flex-col items-center justify-center gap-y-20 py-10'>
			<p className='text-4xl font-medium sm:text-4xl md:text-5xl lg:text-6xl'>
				<span className='inline-block leading-normal'>
					<div className='flex inline-flex shrink flex-col items-center pl-4'>
						Student reviews
						<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={250} />
					</div>
				</span>
			</p>
			<div className='flex flex-col space-y-4 px-6 md:px-0'>
				<Carousel
					px={mobileScreen ? 'lg' : 0}
					maw={width - 50}
					height={200}
					slideSize='40%'
					breakpoints={[
						{ maxWidth: 'md', slideSize: '40%' },
						{ maxWidth: 'sm', slideSize: '100%', slideGap: 'sm' }
					]}
					slideGap='md'
					loop
					align='start'
					styles={{
						control: {
							'&[data-inactive]': {
								opacity: 0,
								cursor: 'default'
							}
						}
					}}
					slidesToScroll={1}
				>
					{slides1}
				</Carousel>
				<Carousel
					px={mobileScreen ? 'lg' : 0}
					maw={width - 50}
					height={200}
					slideSize='40%'
					breakpoints={[
						{ maxWidth: 'md', slideSize: '40%' },
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
					slidesToScroll={1}
				>
					{slides2}
				</Carousel>
			</div>
		</div>
	);
};

export default Reviews;
