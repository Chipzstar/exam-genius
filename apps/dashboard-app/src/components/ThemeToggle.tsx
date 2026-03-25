'use client';

import { useLayoutEffect } from 'react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useValue } from '@legendapp/state/react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { appStore$ } from '~/store/app.store';

/** Keeps Mantine color scheme in sync with persisted Legend-State (hydration + external updates). */
export function ColorSchemeSync() {
	const scheme = useValue(appStore$.colorScheme);
	const { setColorScheme } = useMantineColorScheme();

	useLayoutEffect(() => {
		setColorScheme(scheme);
	}, [scheme, setColorScheme]);

	return null;
}

export function ThemeToggle() {
	const scheme = useValue(appStore$.colorScheme);
	const { setColorScheme } = useMantineColorScheme();

	const toggle = () => {
		const next = scheme === 'dark' ? 'light' : 'dark';
		appStore$.colorScheme.set(next);
		setColorScheme(next);
	};

	return (
		<ActionIcon
			variant='default'
			size='lg'
			onClick={toggle}
			aria-label={scheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
		>
			{scheme === 'dark' ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
		</ActionIcon>
	);
}

/** Fixed bottom-right control; keeps print/PDF layouts clean via paper-no-print. */
export function ThemeToggleFloating() {
	return (
		<div className='paper-no-print fixed bottom-0 right-0 z-[100] mb-4 mr-4'>
			<ThemeToggle />
		</div>
	);
}
