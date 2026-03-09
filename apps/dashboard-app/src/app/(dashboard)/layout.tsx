// Force dynamic so MantineProvider from root is in the tree during render (Next 15 prerender)
export const dynamic = 'force-dynamic';

import DashboardLayoutClient from './DashboardLayoutClient';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
