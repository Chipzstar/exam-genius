'use client';

import { Button, Group, Text } from '@mantine/core';
import { useValue } from '@legendapp/state/react';
import { IconArrowsMaximize, IconPrinter } from '@tabler/icons-react';
import { appStore$, type ReaderFontScale } from '~/store/app.store';

const SCALES: ReaderFontScale[] = [1, 1.125, 1.25];

export function ReaderToolbar() {
	const focusMode = useValue(appStore$.reader.focusMode);
	const fontScale = useValue(appStore$.reader.fontScale);

	const toggleFocus = () => {
		appStore$.reader.focusMode.set(f => !f);
	};

	const setScale = (s: ReaderFontScale) => {
		appStore$.reader.fontScale.set(s);
	};

	const printPaper = () => {
		document.body.dataset.printing = 'true';
		const done = () => {
			delete document.body.dataset.printing;
			window.removeEventListener('afterprint', done);
		};
		window.addEventListener('afterprint', done);
		requestAnimationFrame(() => {
			window.print();
			setTimeout(done, 1000);
		});
	};

	return (
		<Group
			data-cy='reader-toolbar'
			justify='space-between'
			wrap='wrap'
			gap='xs'
			p='xs'
			className='paper-no-print'
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 15,
				borderBottom: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
				backgroundColor: 'light-dark(var(--mantine-color-body), var(--mantine-color-dark-7))'
			}}
		>
			<Group gap='xs'>
				<Button size='sm' variant='light' onClick={toggleFocus} leftSection={<IconArrowsMaximize size={16} />}>
					{focusMode ? 'Exit focus' : 'Focus'}
				</Button>
				<Button size='sm' variant='default' onClick={printPaper} leftSection={<IconPrinter size={16} />}>
					Print
				</Button>
			</Group>
			<Group gap={4} align='center'>
				<Text size='xs' c='dimmed' visibleFrom='xs'>
					Text size
				</Text>
				{SCALES.map(s => (
					<Button
						key={s}
						size='xs'
						variant={fontScale === s ? 'filled' : 'subtle'}
						onClick={() => setScale(s)}
						aria-pressed={fontScale === s}
					>
						{s === 1 ? 'A' : s === 1.125 ? 'A+' : 'A++'}
					</Button>
				))}
			</Group>
		</Group>
	);
}
