'use client';

import React, { useState } from 'react';
import { AppShell, Burger } from '@mantine/core';
import Sidebar from '~/layout/Sidebar';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '@clerk/nextjs';
import TawkWidget from '~/components/TawkWidget';
import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
	const { isSignedIn } = useAuth();
	const [opened, setOpened] = useState(false);
	const mobileScreen = useMediaQuery('(max-width: 48em)');
	const pathname = usePathname();
	const reduceMotion = useReducedMotion();

	return (
		<div className="relative flex min-h-screen font-sans">
			<AppShell
				padding={0}
				navbar={isSignedIn ? {
					width: { sm: 250 },
					breakpoint: 'sm',
					collapsed: { mobile: !opened }
				} : undefined}
				header={
					mobileScreen ? {
						height: 50
					} : undefined
				}
			>
				{isSignedIn && (
					<AppShell.Navbar p={0} data-app-chrome='navbar'>
						<Sidebar opened={opened} setOpened={setOpened} />
					</AppShell.Navbar>
				)}
				
				{mobileScreen && (
					<AppShell.Header p="md" data-app-chrome='header'>
						<div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
							<Burger
								opened={opened}
								onClick={() => setOpened(o => !o)}
								size="sm"
								hiddenFrom="sm"
							/>
						</div>
					</AppShell.Header>
				)}
				
				<AppShell.Main className='w-screen'>
					<motion.div
						key={pathname}
						initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
					>
						{children}
					</motion.div>
					{isSignedIn && <TawkWidget />}
				</AppShell.Main>
			</AppShell>
		</div>
	);
}
