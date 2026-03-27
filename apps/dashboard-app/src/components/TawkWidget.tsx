'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

const TAWK_SCRIPT_SELECTOR = 'script[data-examgenius-tawk="1"]';

type TawkCallback = (error?: unknown) => void;

type TawkLoginData = {
	hash: string;
	userId: string;
	name?: string | { first?: string; last?: string };
	email?: string;
	[key: string]: unknown;
};

type TawkApi = {
	customStyle?: { zIndex?: number | string };
	visitor?: { name?: string; email?: string };
	onLoad?: (() => void) | null;
	login?: (data: TawkLoginData, callback: TawkCallback) => void;
	logout?: (callback: TawkCallback) => void;
	shutdown?: () => void;
	start?: () => void;
};

declare global {
	interface Window {
		Tawk_API?: TawkApi;
		Tawk_LoadStart?: Date;
	}
}

/** In-memory cache: userId → hash. Valid for the tab lifetime. Safe to cache because
 *  HMAC-SHA256(userId, API_KEY) is deterministic — same inputs always produce the same hash.
 *  Keyed by userId so a different user on the same tab always fetches their own hash. */
const tawkHashCache = new Map<string, string>();

async function fetchTawkHash(userId: string): Promise<{ hash: string; userId: string } | null> {
	const cached = tawkHashCache.get(userId);
	console.log('cached', cached);
	if (cached) return { hash: cached, userId };

	try {
		const res = await fetch('/api/tawk/hash');
		console.log('res', res);
		if (!res.ok) return null;
		const data = (await res.json()) as { hash: string; userId: string };
		console.log('data', data);
		tawkHashCache.set(userId, data.hash);
		return data;
	} catch {
		return null;
	}
}

/**
 * Tawk.to live chat for signed-in dashboard users.
 *
 * Session flow:
 *  1. `window.Tawk_API.visitor` — pre-populates name/email before the embed script loads.
 *  2. `Tawk_API.login`          — called in onLoad; links conversation history via server-side HMAC.
 *  3. `Tawk_API.logout`         — called on unmount (user signs out / navigates away from dashboard).
 *
 * @see https://developer.tawk.to/jsapi/#login
 */
export default function TawkWidget({ widgetId, propertyId }: { widgetId: string; propertyId: string }) {
	const { user, isLoaded } = useUser();
	const userRef = useRef(user);
	userRef.current = user;

	useEffect(() => {
		if (!isLoaded || !user) return;

		window.Tawk_API = window.Tawk_API || {};
		/* Above Mantine chrome; below native browser modals if any */
		window.Tawk_API.customStyle = { zIndex: 1_000_000 };

		/**
		 * visitor{} is read before the widget renders — sets the initial name/email shown
		 * to agents even before login() is called. Safe to set in a SPA because we wait
		 * for Clerk `isLoaded` before injecting the script.
		 * @see https://developer.tawk.to/jsapi/#visitor
		 */
		window.Tawk_API.visitor = {
			name: user.fullName ?? user.firstName ?? undefined,
			email: user.emailAddresses[0]?.emailAddress ?? undefined
		};

		/**
		 * onLoad fires once the widget is fully rendered. We then call login() with the
		 * server-side HMAC hash to identify the visitor, restore conversation history, and
		 * surface their name/email in the agent dashboard securely.
		 * @see https://developer.tawk.to/jsapi/#login
		 */
		const priorOnLoad = window.Tawk_API.onLoad;
		window.Tawk_API.onLoad = function () {
			priorOnLoad?.();
			const u = userRef.current;
			if (!u) return;

			void fetchTawkHash(u.id).then(data => {
				console.log('data', data);
				if (!data) return;
				window.Tawk_API?.login?.(
					{
						hash: data.hash,
						userId: data.userId,
						name: u.fullName ?? u.firstName ?? undefined,
						email: u.emailAddresses[0]?.emailAddress ?? undefined
					},
					() => {}
				);
			});
		};

		let inserted: HTMLScriptElement | null = null;
		if (!document.querySelector(TAWK_SCRIPT_SELECTOR)) {
			window.Tawk_LoadStart = new Date();
			inserted = document.createElement('script');
			inserted.async = true;
			inserted.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
			inserted.charset = 'UTF-8';
			inserted.setAttribute('crossorigin', '*');
			inserted.setAttribute('data-examgenius-tawk', '1');
			const first = document.getElementsByTagName('script')[0];
			first?.parentNode?.insertBefore(inserted, first);
		}

		return () => {
			/**
			 * logout() ends the Tawk session for this user before the widget is torn down,
			 * so the next visitor on this device does not see their chat history.
			 * @see https://developer.tawk.to/jsapi/#logout
			 */
			try {
				window.Tawk_API?.logout?.(() => {});
				window.Tawk_API?.shutdown?.();
			} catch {
				/* ignore */
			}
			inserted?.remove();
			document.querySelectorAll(TAWK_SCRIPT_SELECTOR).forEach(el => el.remove());
		};
	}, [isLoaded, user?.id]);

	return null;
}
