import React from 'react';
import { Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export const CTA = () => {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	return (
		<div className='flex flex-col items-center justify-center gap-10 py-20'>
			<p className='text-primary text-xl font-medium'>
				{"Exam season is just around the corner, don't wait until it's too late!"}
			</p>
			<span
				className='text-center font-semibold leading-loose sm:text-4xl md:text-5xl lg:text-6xl'
				style={{ width: mobileScreen ? undefined : 700, lineHeight: mobileScreen ? undefined : '85px' }}
			>
				Get your AI-generated predicted A-level exam papers now.
			</span>
			<a target='_blank' href='https://app.exam-genius.com' rel='noopener noreferrer'>
				<Button
					variant='gradient'
					gradient={{ from: '#6B81FA', to: '#2742F5', deg: 180 }}
					radius='lg'
					styles={theme => ({
						root: {
							width: '250px',
							height: '60px'
						}
					})}
					size='xl'
					uppercase
				>
					Start Now
				</Button>
			</a>
		</div>
	);
};

export default CTA;
