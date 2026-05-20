'use client'

import { POSTHOG_FEATURE_ENABLE_WJEC_EXAM_BOARD } from '@exam-genius/shared/utils'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'

/**
 * PostHog-gated rollout for WJEC Wales exam board in pickers (+ aligned checkout).
 *
 * `ready` is only set to `true` once PostHog confirms flags are loaded — same pattern as
 * {@link useExamLevelSelectionFlag}.
 */
export function useWjecExamBoardFlag(): { enabled: boolean; ready: boolean } {
	const [enabled, setEnabled] = useState(false)
	const [ready, setReady] = useState(false)

	useEffect(() => {
		const cached = posthog.getFeatureFlag(POSTHOG_FEATURE_ENABLE_WJEC_EXAM_BOARD)
		if (cached !== undefined) {
			setEnabled(cached === true)
			setReady(true)
		}

		const unsubscribe = posthog.onFeatureFlags(() => {
			setEnabled(posthog.isFeatureEnabled(POSTHOG_FEATURE_ENABLE_WJEC_EXAM_BOARD) === true)
			setReady(true)
		})

		return unsubscribe
	}, [])

	return { enabled, ready }
}
