import React, { useContext } from 'react';
import { Box, Burger, Button, Divider, Drawer, Group, rem, ScrollArea, Text } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import Image from 'next/image';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import { useDisclosure } from '@mantine/hooks';
import { SneakPeakContext } from '../context/SneakPeakContext';

const useStyles = createStyles(theme => ({
    link: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        paddingLeft: 40,
        paddingRight: 40,
        textDecoration: 'none',
        fontWeight: 400,

        '@media (max-width: 48em)': {
            height: rem(42),
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            '&:hover': {
                backgroundColor: theme.colors.gray[0]
            }
        }
    },
    dropdownFooter: {
        backgroundColor: theme.colors.gray[0],
        margin: `calc(${theme.spacing.md} * -1)`,
        marginTop: theme.spacing.sm,
        padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
        paddingBottom: theme.spacing.xl,
        borderTop: `${rem(1)} solid ${theme.colors.gray[1]}`
    },

    hiddenMobile: {
        '@media (max-width: 48em)': {
            display: 'none'
        }
    },

    hiddenDesktop: {
        '@media (min-width: 48em)': {
            display: 'none'
        }
    }
}));

const Navbar = () => {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const { classes, theme } = useStyles();
    const [sneak, showSneakPeak] = useContext(SneakPeakContext);
    return (
        <Box h={105}>
            <nav className="flex flex-wrap items-center justify-between py-5">
                <div className="mr-6 flex flex-shrink-0 items-center text-white lg:mr-48">
                    <Link href="/">
                        <Image src="/static/images/logo.svg" alt="logo" width={250} height={50} />
                    </Link>
                </div>
                <Group style={{ height: '100%' }} gap={0} className={classes.hiddenMobile}>
                    <div role="button" className={classes.link}>
                        <ScrollLink role="button" to="how-it-works">
                            How it works
                        </ScrollLink>
                    </div>
                    <div role="button" className={classes.link}>
                        <ScrollLink role="button" to="pricing">
                            Pricing
                        </ScrollLink>
                    </div>
                    <div role="button" className={classes.link}>
                        <ScrollLink role="button" to="faq">
                            FAQ
                        </ScrollLink>
                    </div>
                    <div role="button" className={classes.link}>
                        <ScrollLink role="button" to="reviews">
                            Testimonials
                        </ScrollLink>
                    </div>
                </Group>
                <Group className={classes.hiddenMobile}>
                    <a target="_blank" href="https://app.exam-genius.com" rel="noopener noreferrer">
                        <Button size="md" variant="white">
                            <Text fw={400}>Login</Text>
                        </Button>
                    </a>
                    <Button
                        size="md"
                        styles={theme => ({
                            root: {
                                width: '150px',
                                height: '50px'
                            }
                        })}
                        variant="gradient"
                        radius="lg"
                        gradient={{ from: '#6B81FA', to: '#2742F5', deg: 180 }}
                        onClick={() => showSneakPeak(true)}
                    >
                        <Text fw={400}>Start Now</Text>
                    </Button>
                </Group>
                <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
            </nav>
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                className={classes.hiddenDesktop}
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
                    <Divider my="sm" color="gray.1" />
                    <div role="button" className={classes.link}>
                        <ScrollLink to="how-it-works" onClick={closeDrawer}>
                            How it works
                        </ScrollLink>
                    </div>
                    <div role="button" className={classes.link}>
                        <ScrollLink to="pricing" onClick={closeDrawer}>
                            Pricing
                        </ScrollLink>
                    </div>
                    <div role="button" className={classes.link}>
                        <ScrollLink to="faq" onClick={closeDrawer}>
                            FAQ
                        </ScrollLink>
                    </div>

                    <div role="button" className={classes.link}>
                        <ScrollLink to="reviews" onClick={closeDrawer}>
                            Testimonials
                        </ScrollLink>
                    </div>
                    <Divider my="sm" color="gray.1" />
                    <Group justify="center" grow pb="xl" px="md">
                        <a target="_blank" href="https://app.exam-genius.com" rel="noopener noreferrer">
                            <Button fullWidth variant="default">
                                Log in
                            </Button>
                        </a>
                        <Button fullWidth onClick={() => {
                            closeDrawer();
                            showSneakPeak(true);
                        }}>Start Now</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
};

export default Navbar;
