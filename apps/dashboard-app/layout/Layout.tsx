import React, { useState } from 'react';
import { AppShell, Burger, Header, MediaQuery } from '@mantine/core';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '@clerk/nextjs';
import ChatwootWidget from '~/components/Chatwoot';

const Layout = ({ children }) => {
    const { isSignedIn } = useAuth();
    // const isLoggedIn = useMemo(() => !AUTH_ROUTES.includes(router.pathname), [router.pathname]);
    const [opened, setOpened] = useState(false);
    const mobileScreen = useMediaQuery('(max-width: 48em)');

    return (
        <div className="relative flex min-h-screen font-sans">
            <AppShell
                padding={0}
                navbar={isSignedIn ? <Sidebar opened={opened} setOpened={setOpened} /> : undefined}
                navbarOffsetBreakpoint="sm"
                header={
                    mobileScreen ? (
                        <Header height={{ base: 50 }} p="md">
                            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                    <Burger
                                        opened={opened}
                                        onClick={() => setOpened(o => !o)}
                                        size="sm"
                                        color="gray"
                                        mr="xl"
                                    />
                                </MediaQuery>
                            </div>
                        </Header>
                    ) : undefined
                }
            >
                {children}
                {isSignedIn && <ChatwootWidget  />}
            </AppShell>
        </div>
    );
};

export default Layout;
