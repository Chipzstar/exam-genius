'use client';

import React, { useEffect, useMemo } from 'react';
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import { useMantineColorScheme } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import { markSignupIntent, trackDashboardEvent } from '~/utils/analytics';
import { signupSearchParamsParsers } from '~/utils/signup-search-params';

export default function SignUpPage() {
	const { colorScheme } = useMantineColorScheme();
	const [params] = useQueryStates(signupSearchParamsParsers);

	const cachedOnboarding = useMemo(() => {
		if (params.source !== 'landing' || params.phase !== 'sneak_peak') {
			return undefined;
		}
		if (!params.subject || !params.examBoard) {
			return undefined;
		}
		return {
			onboarding_subject: params.subject,
			onboarding_exam_board: params.examBoard,
			onboarding_source: `${params.source}:${params.phase}`
		};
	}, [params.source, params.phase, params.subject, params.examBoard]);

	useEffect(() => {
		markSignupIntent();
		trackDashboardEvent('signup_started', 'signup_start', {
			source: params.source,
			origin_phase: params.phase,
			subject: params.subject ?? undefined,
			exam_board: params.examBoard ?? undefined,
			paper: params.paper ?? undefined
		});
	}, [params.source, params.phase, params.subject, params.examBoard, params.paper]);

	return (
		<div className='h-screen w-full overflow-x-hidden bg-[var(--mantine-color-body)] p-5'>
			<div className='flex h-full justify-center items-center'>
				<SignUp appearance={{
					theme: colorScheme === 'dark' ? dark : undefined,
				}} signInUrl='/login' fallbackRedirectUrl='/' unsafeMetadata={cachedOnboarding} />
			</div>
		</div>
	);
}
