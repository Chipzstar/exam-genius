import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm, zodResolver } from '@mantine/form';
import { PATHS } from '../utils/constants';
import { Button, Group, PasswordInput, Select, Stack, Text, TextInput, Title, useMantineTheme } from '@mantine/core';
import { getE164Number, getStrength, notifyError, notifySuccess } from '../utils/functions';
import { IconCheck, IconChevronDown, IconX } from '@tabler/icons-react';
import { z } from 'zod';
import { trpc } from '../utils/trpc';
import { useSignUp } from '@clerk/nextjs';
import VerificationCode from '../modals/VerificationCode';

export function Signup() {
	const theme = useMantineTheme();
	const [loading, setLoading] = useState(false);
	const [code_form, showCodeForm] = useState(false);
	const { signUp, setActive, setSession } = useSignUp();
	const SignupSchema = z.object({
		full_name: z.string().nullable(),
		email: z.string().email({ message: 'Invalid email' }).max(50),
		password: z
			.string({ required_error: 'Required' })
			.min(6, 'Password must be at least 6 characters')
			.max(50, 'Password must have at most 50 characters')
			.refine(
				(val: string) => getStrength(val) >= 100,
				'Your password is too weak, use the suggestions increase password strength'
			),
		phone: z.string().max(25).optional(),
		year: z.string(),
		role: z.enum(['student', 'teacher', 'examiner']).default('student')
	});
	const register = trpc.auth.signup.useMutation();
	const router = useRouter();
	const form = useForm({
		initialValues: {
			email: '',
			full_name: '',
			password: '',
			year: '',
			role: ''
		},
		validate: zodResolver(SignupSchema)
	});

	const confirmSignUp = useCallback(
		async (code: string) => {
			setLoading(true);
			try {
				// @ts-ignore
				const result = await signUp.attemptEmailAddressVerification({
					code
				});
				// @ts-ignore
				await setActive({ session: result.createdSessionId });
				// @ts-ignore
				await setSession(result.createdSessionId);
				// const user = await register.mutateAsync(values);
				showCodeForm(false);
				setLoading(false);
				notifySuccess('verification-success', 'Verification successful!', <IconCheck size={20} />);
				router.push(PATHS.HOME);
			} catch (error) {
				setLoading(false);
				console.log('Signup Failed');
				notifyError('signup-failure', 'Signup failed. Please try again', <IconX size={20} />);
			}
		},
		[router]
	);

	const handleSubmit = useCallback(
		async values => {
			setLoading(true);
			if (values.phone) values.phone = getE164Number(values.phone);
			try {
				// @ts-ignore
				const result = await signUp.create({
					emailAddress: values.email,
					password: values.password
				});
				// @ts-ignore
				// Prepare the verification process for the email address.
				// This method will send a one-time code to the email address supplied to the current sign-up.
				await signUp.prepareEmailAddressVerification();
				console.log('Showing code form...');
				showCodeForm(true);
				setLoading(false);
				notifySuccess(
					'email-verification',
					'We have sent you an email with a verification code. Please check your inbox.',
					<IconCheck size={20} />
				);
			} catch (err) {
				setLoading(false);
				notifyError('signup-failure', err?.error?.message ?? err.message, <IconX size={20} />);
			}
		},
		[router, signUp, setActive]
	);

	return (
		<div className='h-screen w-full overflow-x-hidden bg-white p-5'>
			<VerificationCode
				opened={code_form}
				onClose={() => showCodeForm(false)}
				onSubmit={confirmSignUp}
				loading={loading}
			/>
			<form
				data-cy='signup-form'
				onSubmit={form.onSubmit(handleSubmit)}
				className='flex h-full w-full flex-col'
				onError={() => console.log(form.errors)}
			>
				<Group position='apart' px='xl'>
					<header className='flex flex-row space-x-2'>
						<Image src='/static/images/logo.svg' width={30} height={30} alt='logo' />
						<span className='text-2xl font-medium'>Exam Genius</span>
					</header>
					<Group spacing='xl'>
						<Text>Have an account?</Text>
						<Button px='xl' variant='outline' color='dark' onClick={() => router.push(PATHS.LOGIN)}>
							Sign in
						</Button>
					</Group>
				</Group>
				<Stack className='mx-auto my-auto w-1/3' spacing={30}>
					<header className='flex flex-col'>
						<Title align='center' color='brand' order={1} size={40} pb={16}>
							Registration
						</Title>
					</header>
					<Group grow spacing={40}>
						<TextInput
							data-cy={'signup-full-name'}
							withAsterisk
							label='Full Name'
							size='lg'
							{...form.getInputProps('full_name', { withError: true })}
						/>
						<TextInput
							data-cy={'signup-email'}
							withAsterisk
							label='Email'
							size='lg'
							{...form.getInputProps('email', { withError: true })}
						/>
					</Group>
					<Group grow spacing={40}>
						<Select
							data={[
								{
									label: 'Student',
									value: 'student'
								},
								{
									label: 'Teacher',
									value: 'teacher'
								},
								{
									label: 'Examiner',
									value: 'examiner'
								}
							]}
							rightSection={<IconChevronDown size='1rem' />}
							rightSectionWidth={30}
							data-cy={'signup-role'}
							withAsterisk
							label='Who are you?'
							size='lg'
							{...form.getInputProps('role', { withError: true })}
						/>
						<Select
							data={[
								{
									label: 'Year 12 (AS-Level)',
									value: '12'
								},
								{
									label: 'Year 13 (A-Levels)',
									value: 'teacher'
								}
							]}
							rightSection={<IconChevronDown size='1rem' />}
							rightSectionWidth={30}
							data-cy={'signup-year'}
							withAsterisk
							label='Current Year?'
							size='lg'
							{...form.getInputProps('year', { withError: true })}
						/>
					</Group>
					<PasswordInput
						data-cy={'signup-password'}
						withAsterisk
						label='Password'
						size='lg'
						{...form.getInputProps('password', { withError: true })}
					/>
					<Group mt='md' position='right'>
						<Button
							type='submit'
							variant='filled'
							size='lg'
							style={{
								width: 200
							}}
							loading={loading}
						>
							<Text weight={500}>Next</Text>
						</Button>
					</Group>
				</Stack>
			</form>
		</div>
	);
}

export default Signup;
