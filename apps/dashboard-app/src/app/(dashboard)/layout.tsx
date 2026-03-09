'use client';

import React, { useState } from 'react';
import { AppShell, Burger } from '@mantine/core';
import Sidebar from '~/layout/Sidebar';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '@clerk/nextjs';
import ChatwootWidget from '~/components/Chatwoot';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { isSignedIn } = useAuth();
	const [opened, setOpened] = useState(false);
	const mobileScreen = useMediaQuery('(max-width: 48em)');

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
					<AppShell.Navbar>
						<Sidebar opened={opened} setOpened={setOpened} />
					</AppShell.Navbar>
				)}
				
				{mobileScreen && (
					<AppShell.Header p="md">
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
					{children}
					{isSignedIn && <ChatwootWidget />}
				</AppShell.Main>
			</AppShell>
		</div>
	);
}
