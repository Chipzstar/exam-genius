import React from 'react';
import { Button } from '@mantine/core';
import Image from 'next/image';

export const Pricing = () => {
	return (
		<div id='pricing' className='flex min-h-screen items-center justify-center py-10'>
			<div className='flex flex-col items-center justify-center space-y-10'>
				<div className='flex flex-col items-center gap-10'>
					<p className='text-2xl font-medium sm:text-4xl md:text-5xl lg:text-6xl'>Simple pricing</p>
					<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={200} />
					<p
						className='text-center text-sm text-gray-500 text-black sm:text-base lg:text-lg'
						style={{ width: '600px' }}
					>
						Our AI technology is continuously learning, so you will always receive the most accurate
						predicted exam papers.
					</p>
				</div>
				<div className='flex flex-col items-center gap-2 border-2 border-black py-5' style={{ width: '400px' }}>
					<p className='font-bold text-blue-700'>Most Popular</p>
					<p className='text-2xl font-normal'>Genius Plan</p>
					<p className='text-center' style={{ width: '250px' }}>
						Full access to multiple subjects until <strong>31st July 2023</strong>
					</p>
					<p className='text-xl'>
						<s>£15</s>
					</p>
					<p className='text-4xl'>£5</p>
					<p className='text-center text-sm' style={{ width: '300px' }}>
						Limited time offer! Get 60% off when you sign up today
					</p>
					<ul className='list-disc items-center' style={{ width: '250px' }}>
						<li>Full access to all predicted exam papers for one A-level subject</li>
						<li>Generate unlimited potential exam papers for one subjects, with predicted answers.</li>
						<li>Instant 24/7 support</li>
					</ul>
					<Button
						mt='lg'
						styles={{
							root: {
								width: '350px',
								height: '90px',
								fontSize: '30px'
							}
						}}
						radius='xs'
						size='l'
					>
						Start Now
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Pricing;