import React, { useMemo } from 'react';
import { AppShell } from '@mantine/core';
import { useRouter } from 'next/router';
import { AUTH_ROUTES } from '../utils/constants';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const router = useRouter();
  const isLoggedIn = useMemo(() => !AUTH_ROUTES.includes(router.pathname), [router.pathname]);

  return (
    <div className='relative flex min-h-screen font-aeonik'>
      <AppShell
        padding={0}
        navbar={isLoggedIn ? <Sidebar /> : undefined}
      >
        {children}
      </AppShell>
    </div>
  )
};

export default Layout;
