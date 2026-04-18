'use client';

import React, { useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import { useMantineColorScheme } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { markSignupIntent, trackDashboardEvent } from '~/utils/analytics';

export default function SignUpPage() {
	const { colorScheme } = useMantineColorScheme();
	const searchParams = useSearchParams();
	const source = searchParams.get('source') ?? 'direct';
	const phase = searchParams.get('phase') ?? 'signup';
	const subject = searchParams.get('subject') ?? undefined;
	const examBoard = searchParams.get('examBoard') ?? undefined;
	const paper = searchParams.get('paper') ?? undefined;

	useEffect(() => {
		markSignupIntent();
		trackDashboardEvent('signup_started', 'signup_start', {
			source,
			origin_phase: phase,
			subject,
			exam_board: examBoard,
			paper
		});
	}, [source, phase, subject, examBoard, paper]);

	return (
		<div className='h-screen w-full overflow-x-hidden bg-[var(--mantine-color-body)] p-5'>
			<div className='flex h-full justify-center items-center'>
				<SignUp appearance={{
					theme: colorScheme === 'dark' ? dark : undefined,
				}} signInUrl='/login' fallbackRedirectUrl='/' />
			</div>
		</div>
	);
}

