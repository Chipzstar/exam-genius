import posthog from 'posthog-js';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

// When deployed to production, route analytics through the Next.js reverse proxy
// so that ad-blockers targeting posthog.com do not interfere with event capture.
const isPrd = process.env.NEXT_PUBLIC_DOPPLER_ENVIRONMENT === 'prd';
const apiHost = isPrd ? '/ph' : posthogHost;

if (posthogKey) {
	posthog.init(posthogKey, {
		api_host: apiHost,
		// ui_host keeps toolbar / session-replay links pointing at the real PostHog UI.
		ui_host: 'https://eu.posthog.com',
		autocapture: true,
		capture_pageview: true,
		capture_pageleave: true,
		// Feature flags: create boolean flag `enable_exam_level_selection` in PostHog (default off).
		defaults: '2026-01-30'
	});

	posthog.capture('posthog_debug_test');
}
