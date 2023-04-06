import React, { useState } from 'react';
import { createStyles, Group, Navbar, getStylesRef } from '@mantine/core';
import { IconChartLine, IconLogout, IconSettings } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { DEFAULT_HEADER_HEIGHT, PATHS } from '../utils/constants';
import { useClerk, useSession } from '@clerk/nextjs';

const useStyles = createStyles((theme, _params) => {
	return {
		header: {
			paddingRight: theme.spacing.md,
			paddingLeft: theme.spacing.sm,
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
			textDecoration: 'none',
			fontSize: theme.fontSizes.sm,
			color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
			padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
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
				backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
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
			paddingTop: theme.spacing.md
		}
	};
});

const Sidebar = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { session } = useSession();

  const tabs = {
    general: [
      {
        link: PATHS.HOME,
        label: 'Dashboard',
        icon: IconChartLine,
        isActive: router.pathname === PATHS.HOME,
        disabled: false
      },
      {
        link: PATHS.PAPERS,
        label: 'Papers',
        icon: IconChartLine,
        isActive: router.pathname === PATHS.PAPERS,
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
    <Navbar width={{ base: 250 }} p='xs'>
      <Navbar.Section className={classes.header}>
        <Group spacing='xs' role='button' onClick={() => router.push(PATHS.HOME)}>
          <Image src='/static/images/logo-with-text.svg' width={100} height={35}  alt=""/>
        </Group>
      </Navbar.Section>
      <Navbar.Section grow>{links}</Navbar.Section>
      <Navbar.Section className={classes.footer}>
        <div
          role='button'
          className={cx(classes.link, { [classes.linkActive]: router.pathname === PATHS.SETTINGS })}
          onClick={() => router.push(PATHS.SETTINGS)}
        >
          <IconSettings className={classes.linkIcon} stroke={1.5} />
          <span>Settings</span>
        </div>
        <div
          data-cy='logout-button'
          role='button'
          className={classes.link}
          onClick={() => signOut()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} /> <span>Logout</span>
        </div>
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
