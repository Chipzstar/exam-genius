'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
	return (
		<div className='h-screen w-full overflow-x-hidden bg-white p-5'>
			<div className='flex h-full justify-center items-center'>
				<SignIn signUpUrl='/signup' />
			</div>
		</div>
	);
}

