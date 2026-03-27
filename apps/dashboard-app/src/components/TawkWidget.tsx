'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { env } from '~/env';

const TAWK_SCRIPT_SELECTOR = 'script[data-examgenius-tawk="1"]';

type TawkCallback = (error?: unknown) => void;

type TawkApi = {
	customStyle?: { zIndex?: number | string };
	onLoad?: (() => void) | null;
	setAttributes?: (attributes: Record<string, string>, callback: TawkCallback) => void;
	logout?: (callback: TawkCallback) => void;
	shutdown?: () => void;
};

declare global {
	interface Window {
		Tawk_API?: TawkApi;
		Tawk_LoadStart?: Date;
	}
}

function syncClerkUserToTawk(userId: string) {
	window.Tawk_API?.setAttributes?.({ clerkid: userId }, () => {});
}

/**
 * Tawk.to live chat for signed-in dashboard users.
 * @see https://developer.tawk.to/jsapi/
 */
export default function TawkWidget() {
	const { user, isLoaded } = useUser();
	const userRef = useRef(user);
	userRef.current = user;

	const propertyId = env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
	const widgetId = env.NEXT_PUBLIC_TAWK_WIDGET_ID;

	useEffect(() => {
		if (!isLoaded || !propertyId || !widgetId) return;

		window.Tawk_API = window.Tawk_API || {};
		/* Above Mantine chrome; below native browser modals if any */
		window.Tawk_API.customStyle = { zIndex: 1_000_000 };

		const priorOnLoad = window.Tawk_API.onLoad;
		window.Tawk_API.onLoad = function () {
			priorOnLoad?.();
			const u = userRef.current;
			if (u) syncClerkUserToTawk(u.id);
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
			try {
				window.Tawk_API?.logout?.(() => {});
				window.Tawk_API?.shutdown?.();
			} catch {
				/* ignore */
			}
			inserted?.remove();
			document.querySelectorAll(TAWK_SCRIPT_SELECTOR).forEach(el => el.remove());
		};
	}, [isLoaded, propertyId, widgetId]);

	useEffect(() => {
		if (!isLoaded || !user) return;
		syncClerkUserToTawk(user.id);
	}, [isLoaded, user?.id]);

	return null;
}
