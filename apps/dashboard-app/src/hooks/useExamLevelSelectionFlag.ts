'use client';

import { POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION } from '@exam-genius/shared/utils';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

/**
 * PostHog-gated rollout for AS/A-level selection UI.
 *
 * `ready` is only set to `true` once PostHog confirms flags are loaded —
 * either from the network response (first visit) or from cache (return visit).
 * This prevents the race where `isFeatureEnabled` returns `undefined` before
 * the /flags request completes, causing the flag to look disabled.
 */
export function useExamLevelSelectionFlag(): { enabled: boolean; ready: boolean } {
	const [enabled, setEnabled] = useState(false);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		// If flags are already cached from a previous request this session,
		// getFeatureFlag returns a real value (not undefined) — use it immediately.
		const cached = posthog.getFeatureFlag(POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION);
		if (cached !== undefined) {
			setEnabled(cached === true);
			setReady(true);
		}

		// onFeatureFlags fires once the /flags network request completes.
		// This is the only guaranteed-correct time to read flag values on first load.
		// It also fires on every subsequent reload (e.g. after identify()).
		const unsubscribe = posthog.onFeatureFlags(() => {
			setEnabled(posthog.isFeatureEnabled(POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION) === true);
			setReady(true);
		});

		return unsubscribe;
	}, []);

	return { enabled, ready };
}
