'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import {
	clearSignupIntent,
	hasSignupIntent,
	hasTrackedSignupCompletion,
	markSignupCompletionTracked,
	trackDashboardEvent
} from '~/utils/analytics';

// PostHog is initialised once in instrumentation-client.ts.
// This component is responsible only for page-view tracking,
// user identification, and signup-completion events.
export function PostHogTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const search = searchParams.toString();
	const { user, isSignedIn, isLoaded } = useUser();

	useEffect(() => {
		trackDashboardEvent('dashboard_page_view', 'dashboard_page_view', {
			pathname,
			search,
			url: window.location.href
		});
	}, [pathname, search]);

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
