import React, { useMemo, useState } from 'react';
import { AppShell, Burger, Header, MediaQuery } from '@mantine/core';
import { useRouter } from 'next/router';
import { AUTH_ROUTES } from '../utils/constants';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@mantine/hooks';

const Layout = ({ children }) => {
	const router = useRouter();
	const isLoggedIn = useMemo(() => !AUTH_ROUTES.includes(router.pathname), [router.pathname]);
	const [opened, setOpened] = useState(false);
	const mobileScreen = useMediaQuery('(max-width: 48em)');

	return (
		<div className='relative flex min-h-screen font-sans'>
			<AppShell
				padding={0}
				navbar={isLoggedIn ? <Sidebar opened={opened} setOpened={setOpened} /> : undefined}
				navbarOffsetBreakpoint='sm'
				header={
					mobileScreen ? (
						<Header height={{ base: 50 }} p='md'>
							<div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
								<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
									<Burger
										opened={opened}
										onClick={() => setOpened(o => !o)}
										size='sm'
										color='gray'
										mr='xl'
									/>
								</MediaQuery>
							</div>
						</Header>
					) : undefined
				}
			>
				{children}
			</AppShell>
		</div>
	);
};

export default Layout;
