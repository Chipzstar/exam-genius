import React from 'react';
import { Button, Image } from '@mantine/core';

export const Hero = () => {
	return (
		<div className='mt-10 flex py-10'>
			<div className='flex grid grid-cols-1 items-center justify-center gap-20 md:grid-cols-2'>
				<div className='flex flex-col gap-10 md:col-span-1'>
					<p className='text-primary text-base font-medium'>Do you want to achieve A*/A?</p>
					<p className='text-4xl font-medium sm:text-4xl md:text-5xl lg:text-6xl'>
						<span className='inline-block leading-tight'>
							Ace your A-level exams
							<div className='flex inline-flex flex-col'>
								<span className='px-3'> with AI.</span>{' '}
								<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={200} />
							</div>
						</span>
					</p>
					<p className='text-sm text-black sm:text-base lg:text-lg'>
						ExamGenius uses AI to read through every exam paper of the last 10 years to predict this years
						questions.
						<br />
						Your personal cheat sheet to study smarter and stress less.
					</p>
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
						SEE EXAMPLES
					</Button>
					<p className='text-grey-500 text-xs'>One-time payment. No subscription.</p>
				</div>
				<div className='md:col-span-1'>
					<Image src='/static/images/hero.svg' alt='' width='100%' height='100%' />
				</div>
			</div>
		</div>
	);
};

export default Hero;
