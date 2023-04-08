import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm, zodResolver } from '@mantine/form';
import { PATHS } from '../utils/constants';
import { Group, useMantineTheme } from '@mantine/core';
import { getE164Number, getStrength, notifyError, notifySuccess } from '../utils/functions';
import { IconCheck, IconX } from '@tabler/icons-react';
import { z } from 'zod';
import { SignUp, useSignUp } from '@clerk/nextjs';
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
			<Group position='apart' px='xl'>
				<header className='flex flex-row space-x-2'>
					<Image src='/static/images/logo.svg' width={30} height={30} alt='logo' />
					<span className='text-2xl font-medium'>Exam Genius</span>
				</header>
			</Group>
			<div className='h-full flex justify-center items-center'>
				<SignUp path='/signup' routing='path' signInUrl='/login' redirectUrl='/' />
			</div>
		</div>
	);
}

export default Signup;
