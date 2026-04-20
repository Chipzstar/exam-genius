import posthog from 'posthog-js';

interface DashboardAnalyticsProperties {
	[key: string]: string | number | boolean | null | undefined;
}

export const SIGNUP_INTENT_STORAGE_KEY = 'eg_signup_intent';
const SIGNUP_COMPLETION_TRACKED_KEY = 'eg_signup_completion_tracked';

function getBaseProperties(phase: string): DashboardAnalyticsProperties {
	return {
		app: 'dashboard-app',
		phase,
		timestamp: new Date().toISOString(),
		distinct_id: posthog.get_distinct_id() ?? 'anonymous'
	};
}

export function trackDashboardEvent(event: string, phase: string, properties: DashboardAnalyticsProperties = {}) {
	if (typeof window === 'undefined') return;

	posthog.capture(event, {
		...getBaseProperties(phase),
		...properties
	});
}

export function markSignupIntent() {
	if (typeof window === 'undefined') return;
	window.sessionStorage.setItem(SIGNUP_INTENT_STORAGE_KEY, '1');
}

export function clearSignupIntent() {
	if (typeof window === 'undefined') return;
	window.sessionStorage.removeItem(SIGNUP_INTENT_STORAGE_KEY);
}

export function hasSignupIntent() {
	if (typeof window === 'undefined') return false;
	return window.sessionStorage.getItem(SIGNUP_INTENT_STORAGE_KEY) === '1';
}

export function hasTrackedSignupCompletion() {
	if (typeof window === 'undefined') return false;
	return window.sessionStorage.getItem(SIGNUP_COMPLETION_TRACKED_KEY) === '1';
}

export function markSignupCompletionTracked() {
	if (typeof window === 'undefined') return;
	window.sessionStorage.setItem(SIGNUP_COMPLETION_TRACKED_KEY, '1');
}
