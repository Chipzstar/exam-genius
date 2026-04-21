import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';

export type ReaderFontScale = 1 | 1.125 | 1.25;

export type LastOpenedPaper = {
	paperId: string;
	courseId: string;
	unit: string;
	href: string;
	code: string;
	subject: string;
	board: string;
	name: string;
	openedAt: number;
	resumeUrl: string;
};

export type RecentPaper = LastOpenedPaper;

function envFlag(v: string | undefined): boolean {
	return v === 'true';
}

const initialState = {
	colorScheme: 'dark' as 'dark' | 'light',
	lastOpenedPaper: null as LastOpenedPaper | null,
	recentPapers: [] as RecentPaper[],
	reader: {
		fontScale: 1 as ReaderFontScale,
		focusMode: false,
		rendererMode: 'structured' as 'structured' | 'classic',
		paperMode: 'study' as 'study' | 'mock' | 'review'
	},
	flags: {
		structuredQuestions: envFlag(process.env.NEXT_PUBLIC_FLAG_STRUCTURED_QUESTIONS),
		questionEdits: envFlag(process.env.NEXT_PUBLIC_FLAG_QUESTION_EDITS),
		paperReferences: envFlag(process.env.NEXT_PUBLIC_FLAG_PAPER_REFERENCES),
		aiMarking: envFlag(process.env.NEXT_PUBLIC_FLAG_AI_MARKING)
	},
	onboarding: {
		subject: '',
		board: ''
	}
};

export const appStore$ = observable(initialState);

if (typeof window !== 'undefined') {
	syncObservable(appStore$, {
		persist: {
			name: 'exam-genius-v1',
			plugin: ObservablePersistLocalStorage
		}
	});
}

const MAX_RECENT = 5;

/** Clears persisted user-specific state so the next account on this browser does not see it. Keeps colorScheme as a device preference. */
export function resetAppStoreOnLogout() {
	if (typeof window === 'undefined') return;
	const colorScheme = appStore$.colorScheme.peek();
	appStore$.set({
		...initialState,
		colorScheme
	});
}

export function recordPaperOpen(entry: Omit<LastOpenedPaper, 'openedAt'> & { openedAt?: number }) {
	const openedAt = entry.openedAt ?? Date.now();
	const full: LastOpenedPaper = { ...entry, openedAt };
	appStore$.lastOpenedPaper.set(full);

	const existing = appStore$.recentPapers.get() ?? [];
	const withoutDup = existing.filter(p => p.paperId !== full.paperId);
	const next = [full, ...withoutDup].slice(0, MAX_RECENT);
	appStore$.recentPapers.set(next);
}
