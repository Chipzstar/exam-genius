import React, { useCallback, useEffect, useState } from 'react';
import { notifyError } from '../utils/functions';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import { Anchor, Button, Group, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../utils/constants';
import Image from 'next/image';
import { useSignIn } from '@clerk/nextjs';
import { LoginUser } from '../utils/types';

const Login = () => {
	const [loading, setLoading] = useState(false);
	const { isLoaded, signIn, setActive } = useSignIn();
	const router = useRouter();
	const form = useForm<LoginUser>({
		initialValues: {
			email: '',
			password: ''
		},
		validate: values => ({
			email: !values.email ? 'Required' : null,
			password: !values.password ? 'Required' : null
		})
	});

	const handleSignIn = useCallback(
		async (values: LoginUser) => {
			try {
				setLoading(true);
				// @ts-ignore
				const result = await signIn.create({
					identifier: values.email,
					password: values.password
				});
				if (result.status === 'complete' && !!result.createdSessionId) {
					console.log('Login Success');
					console.log(result);
					// @ts-ignore
					await setActive({ session: result.createdSessionId });
					await router.replace('/');
					return;
				} else {
					console.log('Login Failed');
					// Something went wrong
					if (result.status === 'needs_identifier') {
						form.setFieldError('email', 'Email is incorrect');
					} else if (result.status === 'needs_first_factor') {
						form.setFieldError('password', 'Password is incorrect');
					} else {
						notifyError('login-failure', 'Password is incorrect', <IconX />);
					}
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
				notifyError('login-failure', error.error?.message ?? error.message, <IconX />);
				console.log(error);
			}
		},
		[router]
	);

	useEffect(() => {
		if (router.query?.error) {
			const message = String(router.query.error);
			notifyError('login-failed', message, <IconX />);
		}
	}, [router.query]);

	return (
		<div className='h-screen w-full overflow-x-hidden bg-white p-5'>
			<form
				data-cy='login-form'
				onSubmit={form.onSubmit(handleSignIn)}
				className='flex h-full w-full flex-col'
				onError={() => console.log(form.errors)}
			>
				<Group position='apart' px='xl'>
					<header className='flex flex-row space-x-2'>
						<Image src='/static/images/logo.svg' width={30} height={30} alt='logo' />
						<span className='text-2xl font-medium'>Exam Genius</span>
					</header>
					<Group spacing='xl'>
						<Text>{"Don't have an account?"}</Text>
						<Link href={PATHS.SIGNUP}>
							<span role='button' className='text-primary'>
								Sign up
							</span>
						</Link>
					</Group>
				</Group>
				<Stack className='mx-auto my-auto w-1/3' spacing='lg'>
					<header className='flex flex-col'>
						<Title align='center' color='brand' order={1} size={40} pb={16}>
							Login
						</Title>
					</header>
					<TextInput
						label='Email'
						{...form.getInputProps('email', { withError: true })}
						data-cy={'login-email'}
						size='lg'
					/>
					<PasswordInput
						label='Password'
						{...form.getInputProps('password', { withError: true })}
						data-cy={'login-password'}
						size='lg'
					/>
					<Link href={PATHS.FORGOT_PASSWORD} passHref>
						<Anchor size='sm' color='brand'>
							Forgot password?
						</Anchor>
					</Link>
					<Group py='md'>
						<Button type='submit' size='lg' loading={loading} fullWidth>
							<Text weight='normal'>Sign in</Text>
						</Button>
					</Group>
				</Stack>
			</form>
		</div>
	);
};

export default Login;
