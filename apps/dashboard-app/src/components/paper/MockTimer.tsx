'use client';

import { Button, Group, Text } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';

type Props = {
	initialSeconds: number;
	onExpire?: () => void;
};

export function MockTimer({ initialSeconds, onExpire }: Props) {
	const [remaining, setRemaining] = useState(initialSeconds);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (paused || remaining <= 0) return;
		const t = setInterval(() => {
			setRemaining(r => {
				if (r <= 1) {
					clearInterval(t);
					onExpire?.();
					return 0;
				}
				return r - 1;
			});
		}, 1000);
		return () => clearInterval(t);
	}, [paused, remaining, onExpire]);

	const fmt = useCallback((s: number) => {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${m}:${sec.toString().padStart(2, '0')}`;
	}, []);

	return (
		<Group gap='md'>
			<Text fw={600} size='lg'>
				{fmt(remaining)}
			</Text>
			<Button size='xs' variant='light' onClick={() => setPaused(p => !p)}>
				{paused ? 'Resume' : 'Pause'}
			</Button>
		</Group>
	);
}
