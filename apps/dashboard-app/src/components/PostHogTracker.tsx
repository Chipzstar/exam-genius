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

export function PostHogTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const search = searchParams.toString();
	const { user, isSignedIn, isLoaded } = useUser();

	useEffect(() => {
		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

		if (!posthogKey) return;

		const posthogClient = posthog as { __loaded?: boolean };
		if (posthogClient.__loaded) return;

		posthog.init(posthogKey, {
			api_host: posthogHost,
			autocapture: true,
			capture_pageview: false,
			capture_pageleave: true,
			persistence: 'localStorage+cookie'
		});
	}, []);

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
