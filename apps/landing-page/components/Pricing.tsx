import React, { useContext } from 'react';
import { Button } from '@mantine/core';
import Image from 'next/image';
import { useMediaQuery } from '@mantine/hooks';
import { SneakPeakContext } from '../context/SneakPeakContext';

export const Pricing = () => {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const [sneak, showSneakPeak] = useContext(SneakPeakContext);
	return (
		<div id='pricing' className='flex min-h-screen items-center justify-center py-10'>
			<div className='flex flex-col items-center justify-center space-y-10'>
				<div className='flex flex-col items-center gap-10'>
					<p className='text-2xl font-medium sm:text-4xl md:text-5xl lg:text-6xl'>Simple pricing</p>
					<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={200} />
					<p
						className='px-4 text-center text-sm text-gray-500 text-black sm:text-base md:px-0 lg:text-lg'
						style={{ width: mobileScreen ? undefined : '600px' }}
					>
						Our AI technology is continuously learning, so you will always receive the most accurate
						predicted exam papers.
					</p>
				</div>
				<div
					className='flex flex-col items-center gap-2 space-y-7 py-5 md:border-2 md:border-black'
					style={{ width: mobileScreen ? undefined : 400 }}
				>
					<div className='flex flex-col items-center space-y-4'>
						<p className='text-2xl font-normal'>Genius Plan</p>
						<p className='text-center' style={{ width: '250px' }}>
							Available until <strong>31st July 2025</strong>
						</p>
					</div>
					<p className='text-4xl'>£5</p>
					<ul className='list-disc items-center' style={{ width: '300px' }}>
						<li>
							Full access to all predicted exam papers per <strong>subject</strong> and{' '}
							<strong>exam board</strong>.
						</li>
						<li>Generate one set of papers per subject with predicted answers and probability scores.</li>
						<li>24/7 support</li>
					</ul>
					<Button
						mt='lg'
						styles={{
							root: mobileScreen
								? undefined
								: {
										width: '350px',
										height: '90px',
										fontSize: '30px'
								  }
						}}
						radius='xs'
						size='xl'
						onClick={() => showSneakPeak(true)}
					>
						Start Now
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Pricing;
