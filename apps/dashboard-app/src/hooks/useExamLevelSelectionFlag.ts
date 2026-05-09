'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION } from '@exam-genius/shared/utils';

/**
 * PostHog-gated rollout for AS/A-level selection UI.
 * Create flag `{POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION}` in PostHog (boolean, default off).
 */
export function useExamLevelSelectionFlag(): { enabled: boolean; ready: boolean } {
	const [enabled, setEnabled] = useState(false);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const sync = () => {
			setEnabled(posthog.isFeatureEnabled(POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION) === true);
			setReady(true);
		};
		sync();
		const unsubscribe = posthog.onFeatureFlags(sync);
		return unsubscribe;
	}, []);

	return { enabled, ready };
}
