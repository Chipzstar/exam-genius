'use client';

import { useClerk } from '@clerk/nextjs';
import { Group, Text } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { IconLicense, IconLogout, IconQuestionMark, IconUser } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { resetAppStoreOnLogout } from '~/store/app.store';
import { PATHS } from '~/utils/constants';
import classes from './Sidebar.module.css';

const Sidebar = ({ opened, setOpened }: { opened: boolean; setOpened: (opened: boolean) => void }) => {
	const { width } = useViewportSize();
	const router = useRouter();
	const pathname = usePathname();
	const { signOut } = useClerk();

	const tabs = {
		general: [
			{
				link: PATHS.HOME,
				label: 'Papers',
				icon: IconLicense,
				isActive: pathname === PATHS.HOME,
				disabled: false
			},
			{
				link: PATHS.PROFILE,
				label: 'Profile',
				icon: IconUser,
				isActive: pathname === PATHS.PROFILE,
				disabled: false
			},
			{
				link: PATHS.FAQ,
				label: 'FAQ',
				icon: IconQuestionMark,
				isActive: pathname === PATHS.FAQ,
				disabled: false
			}
		]
	};
	const [section, setSection] = useState<'account' | 'general'>('general');

	const links = tabs[section].map((item, index) => (
		<div
			role='button'
			className={clsx(classes.link, {
				[classes.linkDisabled]: item.disabled,
				[classes.linkActive]: item.isActive
			})}
			key={index}
			onClick={() => {
				!item.disabled && router.push(item.link)
				opened && setOpened(false)
			}}
		>
			<item.icon className={classes.linkIcon} stroke={1.5} />
			<span>{item.label}</span>
		</div>
	));

	return (
		<div className={classes.navbar} style={{ padding: 'var(--mantine-spacing-xs)' }}>
			<div className={classes.header}>
				<Group gap='sm' role='button' onClick={() => router.push(PATHS.HOME)}>
					<Image src='/static/images/logo-blue.svg' width={40} height={35} alt='' />
                    <Text size="24px" fw={600} c="brand">
                        ExamGenius
                    </Text>
				</Group>
			</div>
			<div style={{ flex: 1, marginTop: '100px' }} className='flex flex-col'>
				{links}
				<div className='mt-auto'>
					<div
						data-cy='logout-button'
						role='button'
						className={classes.link}
						onClick={() => {
							resetAppStoreOnLogout();
							void signOut();
						}}
					>
						<IconLogout className={classes.linkIcon} stroke={1.5} /> <span>Logout</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
