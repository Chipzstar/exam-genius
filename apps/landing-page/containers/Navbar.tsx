import React from 'react';
import { Button, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
	return (
		<div className='container mx-auto'>
			<div className='flex items-center justify-between py-5'>
				<Link href='/'>
					<Image src='/static/images/logo.svg' alt='logo' width={200} height={40} />
				</Link>
				<div className='flex items-center gap-10'>
					<p>Student reviews</p>

					<p>How it works</p>

					<p>Pricing</p>

					<p>FAQ</p>
				</div>
				<div className='flex items-center gap-3'>
					<Button size='md' variant='white'>
						<Text weight='normal'>Login</Text>
					</Button>
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
