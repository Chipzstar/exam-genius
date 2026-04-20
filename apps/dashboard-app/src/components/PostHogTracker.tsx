'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import {
	clearSignupIntent,
	hasSignupIntent,
	hasTrackedSignupCompletion,
	markSignupCompletionTracked,
	trackDashboardEvent
} from '~/utils/analytics';

// PostHog is initialised once in instrumentation-client.ts with capture_pageview: true.
// This component handles user identification and signup-completion events only.
export function PostHogTracker() {
	const pathname = usePathname();
	const { user, isSignedIn, isLoaded } = useUser();

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !user) return;

		posthog.identify(user.id, {
			email: user.primaryEmailAddress?.emailAddress,
			first_name: user.firstName,
			last_name: user.lastName
		});
	}, [isLoaded, isSignedIn, user]);

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !user) return;
		if (!hasSignupIntent() || hasTrackedSignupCompletion()) return;

		trackDashboardEvent('signup_completed', 'signup_complete', {
			user_id: user.id,
			pathname
		});
		markSignupCompletionTracked();
		clearSignupIntent();
	}, [isLoaded, isSignedIn, user, pathname]);

	return null;
}
