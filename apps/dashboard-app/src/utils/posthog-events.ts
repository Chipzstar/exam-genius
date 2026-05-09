import posthog from 'posthog-js';

/** Prefer passing `exam_level` (`a_level` | `as_level`) when known from the owning course. */
export function capturePaperGeneration(event: 'started' | 'succeeded' | 'failed', props?: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	posthog.capture(`paper_generation_${event}`, props);
}

export function captureQuestionEdit(event: 'submitted' | 'succeeded' | 'failed', props?: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	posthog.capture(`question_edit_${event}`, props);
}

export function captureReference(event: 'uploaded' | 'extracted' | 'rejected', props?: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	posthog.capture(`reference_${event}`, props);
}

export function captureRating(kind: 'paper' | 'question', props?: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	posthog.capture(`rating_${kind}_submitted`, props);
}

/** Prefer passing `exam_level` (`a_level` | `as_level`) when known from the owning course. */
export function captureAttempt(event: 'started' | 'submitted' | 'marked', props?: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	posthog.capture(`attempt_${event}`, props);
}
