'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import { useMantineColorScheme } from '@mantine/core';

export default function SignUpPage() {
	const { colorScheme } = useMantineColorScheme();
	return (
		<div className='h-screen w-full overflow-x-hidden bg-[var(--mantine-color-body)] p-5'>
			<div className='flex h-full justify-center items-center'>
				<SignUp appearance={{
					theme: colorScheme === 'dark' ? dark : undefined,
				}} signInUrl='/login' />
			</div>
		</div>
	);
}

