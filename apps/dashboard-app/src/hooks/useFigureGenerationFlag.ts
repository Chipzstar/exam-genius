'use client';

import { POSTHOG_FEATURE_ENABLE_FIGURE_GENERATION } from '@exam-genius/shared/utils';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

/**
 * PostHog-gated rollout for async figure generation features.
 * Defaults to disabled until feature flags are loaded.
 */
export function useFigureGenerationFlag(): { enabled: boolean; ready: boolean } {
	const [enabled, setEnabled] = useState(false);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const cached = posthog.getFeatureFlag(POSTHOG_FEATURE_ENABLE_FIGURE_GENERATION);
		if (cached !== undefined) {
			setEnabled(cached === true);
			setReady(true);
		}

		const unsubscribe = posthog.onFeatureFlags(() => {
			setEnabled(posthog.isFeatureEnabled(POSTHOG_FEATURE_ENABLE_FIGURE_GENERATION) === true);
			setReady(true);
		});

		return unsubscribe;
	}, []);

	return { enabled, ready };
}
