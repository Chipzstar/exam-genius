import React, { useCallback, useEffect, useState } from 'react';
import { notifyError } from '../utils/functions';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import { SignIn, useSignIn } from '@clerk/nextjs';
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
					// @ts-ignore
					await setActive({ session: result.createdSessionId });
					await router.replace('/');
					return;
				} else {
					// Something went wrong
					if (result.status === 'needs_identifier') {
						form.setFieldError('email', 'Email is incorrect');
					} else if (result.status === 'needs_first_factor') {
						form.setFieldError('password', 'Password is incorrect');
					} else {
						notifyError('login-failure', 'Password is incorrect', <IconX size={20} />);
					}
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
				notifyError('login-failure', error.error?.message ?? error.message, <IconX />);
			}
		},
		[router, signIn, setActive]
	);

	useEffect(() => {
		if (router.query?.error) {
			const message = String(router.query.error);
			notifyError('login-failed', message, <IconX />);
		}
	}, [router.query]);

	return (
		<div className='h-screen w-full overflow-x-hidden bg-white p-5'>
			<form data-cy='login-form' onSubmit={form.onSubmit(handleSignIn)} className='flex h-full w-full flex-col'>
				<div className='flex h-full justify-center items-center'>
					<SignIn path='/login' routing='hash' signUpUrl='/signup' />
				</div>
			</form>
		</div>
	);
};

export default Login;
