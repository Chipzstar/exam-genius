'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
	return (
		<div className='h-screen w-full overflow-x-hidden bg-white p-5'>
			<div className='flex h-full justify-center items-center'>
				<SignUp signInUrl='/login' />
			</div>
		</div>
	);
}

