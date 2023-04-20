import React, { useState } from 'react';
import { createStyles, getStylesRef, Group, Navbar, Text } from '@mantine/core';
import { IconLicense, IconLogout, IconUser } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { DEFAULT_HEADER_HEIGHT, PATHS } from '../utils/constants';
import { useClerk } from '@clerk/nextjs';
import { useViewportSize } from '@mantine/hooks';

const useStyles = createStyles((theme, _params) => {
	return {
		header: {
			paddingLeft: theme.spacing.xs,
			paddingTop: theme.spacing.xs,
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
			minHeight: DEFAULT_HEADER_HEIGHT - 10
		},
		navbar: {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
		},

		title: {
			textTransform: 'uppercase',
			letterSpacing: -0.25
		},

		link: {
			...theme.fn.focusStyles(),
			display: 'flex',
			alignItems: 'center',
			fontSize: theme.fontSizes.lg,
			color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
			padding: `10px 20px`,
			borderRadius: theme.radius.sm,
			fontWeight: 500,

			'&:hover': {
				backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
				color: theme.colorScheme === 'dark' ? theme.white : theme.black,

				[`& .${getStylesRef('icon')}`]: {
					color: theme.colorScheme === 'dark' ? theme.white : theme.black
				}
			}
		},
		linkIcon: {
			ref: getStylesRef('icon'),
			color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
			marginRight: theme.spacing.sm
		},
		linkActive: {
			'&, &:hover': {
				color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
				[`& .${getStylesRef('icon')}`]: {
					color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color
				}
			}
		},
		linkDisabled: {
			color: theme.colors.gray[5],
			'&, &:hover': {
				color: theme.colors.gray[5],
				[`& .${getStylesRef('icon')}`]: {
					color: theme.colors.gray[5]
				}
			}
		},
		footer: {
			borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
			paddingTop: theme.spacing.lg
		}
	};
});

const Sidebar = ({opened, setOpened}) => {
	const { width } = useViewportSize();
	const router = useRouter();
	const { signOut } = useClerk();

	const tabs = {
		general: [
			{
				link: PATHS.HOME,
				label: 'Papers',
				icon: IconLicense,
				isActive: router.pathname === PATHS.HOME,
				disabled: false
			},
			{
				link: PATHS.PROFILE,
				label: 'Profile',
				icon: IconUser,
				isActive: router.pathname === PATHS.PROFILE,
				disabled: false
			}
		]
	};
	const { classes, cx } = useStyles();
	const [section, setSection] = useState<'account' | 'general'>('general');

	const links = tabs[section].map((item, index) => (
		<div
			role='button'
			className={cx(classes.link, {
				[classes.linkDisabled]: item.disabled,
				[classes.linkActive]: item.isActive
			})}
			key={index}
			onClick={() => !item.disabled && router.push(item.link)}
		>
			<item.icon className={classes.linkIcon} stroke={1.5} />
			<span>{item.label}</span>
		</div>
	));

	return (
		<Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ base: width, md: 250 }} p='xs'>
			<Navbar.Section className={classes.header}>
				<Group spacing='sm' role='button' onClick={() => router.push(PATHS.HOME)}>
					<Image src='/static/images/logo-blue.svg' width={40} height={35} alt='' />
                    <Text size={24} weight='600' color="brand">
                        ExamGenius
                    </Text>
				</Group>
			</Navbar.Section>
			<Navbar.Section grow mt={100} className="flex flex-col">
				{links}
				<div data-cy='logout-button' role='button' className={classes.link} onClick={() => signOut()}>
					<IconLogout className={classes.linkIcon} stroke={1.5} /> <span>Logout</span>
				</div>
			</Navbar.Section>
		</Navbar>
	);
};

export default Sidebar;
