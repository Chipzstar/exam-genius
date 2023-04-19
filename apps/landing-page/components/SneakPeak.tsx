import React, { useState } from 'react';
import { Button, Image, Text } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import SneakPeakSlideshow from '../modals/SneakPeakSlideshow';

const SneakPeak = () => {
	const [sneak, showSneakPeak] = useState(false);
	return (
		<div id='how-it-works' className='flex h-screen flex-col items-center justify-center py-10 md:gap-y-20'>
			<SneakPeakSlideshow opened={sneak} onClose={() => showSneakPeak(false)} />
			<p className='text-center text-4xl font-medium sm:text-4xl md:text-5xl lg:text-6xl'>
				<span className='inline-block leading-normal'>
					📚 Study smarter with ExamGenius’ AI
					<div className='flex inline-flex shrink flex-col items-center pl-4'>
						<span> predicted papers</span>
						<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={250} />
					</div>
				</span>
			</p>
			<div style={{ width: 800 }} className='text-center text-xl'>
				<span>
					Our AI has read exam papers for the previous 10 years and uses this data to predict which questions
					are likely to come up in this years papers with <br />
					<span className='text-primary'>85% accuracy.</span>
				</span>
			</div>
			<div>
				<Button
					size='xl'
					variant='outline'
					leftIcon={<IconPlayerPlay stroke={1.5} />}
					onClick={() => showSneakPeak(true)}
				>
					<Text>See example questions</Text>
				</Button>
			</div>
			<div className='flex-col space-y-8'>
				<span className='flex justify-center text-center'>Trusted by our students at</span>
				<div className='flex items-center justify-around space-x-6'>
					<Image src='/static/images/oxford.svg' alt='oxford' width={198} height={60} />
					<Image src='/static/images/cambridge.svg' alt='cambridge' width={154} height={80} />
					<Image src='/static/images/imperial.svg' alt='imperial-college' width={196} height={48} />
					<Image src='/static/images/UCL.svg' alt='ucl' width={176} height={66} />
					<Image src='/static/images/KCL.svg' alt='kings-college' width={125} height={66} />
					<Image src='/static/images/manchester.svg' alt='manchester' width={100} height={66} />
					<Image src='/static/images/warwick.svg' alt='warwick' width={99} height={66} />
				</div>
			</div>
		</div>
	);
};

export default SneakPeak;
