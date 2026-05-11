'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { logger, POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION } from '@exam-genius/shared/utils';

/** Same semantics as dashboard hook — landing PostHog init lives in instrumentation-client. */
export function useExamLevelSelectionFlag(): { enabled: boolean; ready: boolean } {
	const [enabled, setEnabled] = useState(false);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const cached = posthog.getFeatureFlag(POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION);
		logger.debug('useExamLevelSelectionFlag: cached flag', cached);
		if (cached !== undefined) {
			setEnabled(cached === true);
			setReady(true);
		}

		const unsubscribe = posthog.onFeatureFlags(() => {
			setEnabled(posthog.isFeatureEnabled(POSTHOG_FEATURE_ENABLE_EXAM_LEVEL_SELECTION) === true);
			setReady(true);
		});

		return unsubscribe;
	}, []);

	return { enabled, ready };
}
