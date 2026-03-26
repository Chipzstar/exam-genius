'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';
import { useMantineColorScheme } from '@mantine/core';
import { dark } from '@clerk/themes'


export default function LoginPage() {
	const { colorScheme } = useMantineColorScheme();
	return (
		<div className='h-screen w-full overflow-x-hidden bg-[var(--mantine-color-body)] p-5'>
			<div className='flex h-full justify-center items-center'>
				<SignIn appearance={{
					theme: colorScheme === 'dark' ? dark : undefined,
				}} signUpUrl='/signup' />
			</div>
		</div>
	);
}

