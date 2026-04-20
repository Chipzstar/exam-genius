import posthog from 'posthog-js';

interface LandingAnalyticsProperties {
	[key: string]: string | number | boolean | null | undefined;
}

function getBaseProperties(phase: string): LandingAnalyticsProperties {
	return {
		app: 'landing-page',
		phase,
		timestamp: new Date().toISOString(),
		distinct_id: posthog.get_distinct_id() ?? 'anonymous'
	};
}

function captureLandingEvent(event: string, phase: string, properties: LandingAnalyticsProperties = {}) {
	if (typeof window === 'undefined') return;

	posthog.capture(event, {
		...getBaseProperties(phase),
		...properties
	});
}

export function trackLandingPageVisit(properties: LandingAnalyticsProperties = {}) {
	captureLandingEvent('landing_page_visit', 'landing_visit', properties);
}

export function trackLandingCtaClick(
	ctaLabel: string,
	location: string,
	properties: LandingAnalyticsProperties = {}
) {
	captureLandingEvent('landing_cta_clicked', 'cta_click', {
		cta_label: ctaLabel,
		location,
		...properties
	});
}

export function trackStartNowClick(location: string, properties: LandingAnalyticsProperties = {}) {
	captureLandingEvent('landing_start_now_clicked', 'start_now_click', {
		location,
		...properties
	});
}

export function trackSneakPeakOpened(source: string, properties: LandingAnalyticsProperties = {}) {
	captureLandingEvent('landing_sneak_peak_opened', 'sneak_peak_open', {
		source,
		...properties
	});
}

export function trackSneakPeakStepCompleted(step: string, properties: LandingAnalyticsProperties = {}) {
	captureLandingEvent('landing_sneak_peak_step_completed', 'sneak_peak_step', {
		step,
		...properties
	});
}

export function trackSneakPeakEngagement(properties: LandingAnalyticsProperties = {}) {
	captureLandingEvent('landing_sneak_peak_engaged', 'sneak_peak_engagement', properties);
}

export function trackSignupCtaClick(properties: LandingAnalyticsProperties = {}) {
	captureLandingEvent('landing_signup_cta_clicked', 'signup_handoff', properties);
}
