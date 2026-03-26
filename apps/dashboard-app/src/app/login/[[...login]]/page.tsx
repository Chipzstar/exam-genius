'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { dark, default as light } from '@clerk/ui/themes'


export default function LoginPage() {
	const { colorScheme } = useMantineColorScheme();
	return (
		<div className='h-screen w-full overflow-x-hidden bg-white p-5'>
			<div className='flex h-full justify-center items-center'>
				<SignIn appearance={{
					theme: colorScheme === 'dark' ? dark : light,
				}} signUpUrl='/signup' />
			</div>
		</div>
	);
}

