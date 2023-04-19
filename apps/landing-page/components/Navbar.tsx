import React from 'react';
import { Button, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
	return (
		<div className='mx-auto'>
			<div className='flex items-center justify-between py-5'>
				<Link href='/'>
					<Image src='/static/images/logo.svg' alt='logo' width={200} height={40} />
				</Link>
				<div className='flex items-center gap-10'>
					<div role='button'>
						<ScrollLink to='reviews'>Student reviews</ScrollLink>
					</div>
					<div role='button'>
						<ScrollLink to='how-it-works'>How it works</ScrollLink>
					</div>

					<div role='button'>
						<ScrollLink to='pricing'>Pricing</ScrollLink>
					</div>

					<div role='button'>
						<ScrollLink to='faq'>FAQ</ScrollLink>
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<a target='_blank' href='https://app.exam-genius.com' rel='noopener noreferrer'>
						<Button size='md' variant='white'>
							<Text weight='normal'>Login</Text>
						</Button>
					</a>
					<Button
						size='md'
						styles={theme => ({
							root: {
								width: '150px',
								height: '50px'
							}
						})}
						variant='gradient'
						radius='lg'
						gradient={{ from: '#6B81FA', to: '#2742F5', deg: 180 }}
					>
						<Text weight='normal'>Start Now</Text>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
