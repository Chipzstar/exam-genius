import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, zodResolver } from '@mantine/form';
import { PATHS } from '../../utils/constants';
import { getStrength, notifyError, notifySuccess } from '../../utils/functions';
import { IconCheck, IconX } from '@tabler/icons-react';
import { z } from 'zod';
import { SignUp, useSignUp } from '@clerk/nextjs';

export function Signup() {
	const [loading, setLoading] = useState(false);
	const [code_form, showCodeForm] = useState(false);
	const { signUp, setActive } = useSignUp();
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
				showCodeForm(false);
				setLoading(false);
				notifySuccess('verification-success', 'Verification successful!', <IconCheck size={20} />);
				router.push(PATHS.HOME);
			} catch (error) {
				setLoading(false);
				notifyError('signup-failure', 'Signup failed. Please try again', <IconX size={20} />);
			}
		},
		[router]
	);

	/*const handleSubmit = useCallback(
		async values => {
			setLoading(true);
			if (values.phone) values.phone = getE164Number(values.phone);
			try {
				// @ts-ignore
                await signUp.create({
                    emailAddress: values.email,
                    password: values.password
                });
                // @ts-ignore
                // Prepare the verification process for the email address.
                // This method will send a one-time code to the email address supplied to the current sign-up.
                await signUp.prepareEmailAddressVerification();
                showCodeForm(true);
                setLoading(false);
                notifySuccess(
                    'email-verification',
                    'We have sent you an email with a verification code. Please check your inbox.',
                    <IconCheck size={20} />
                );
            }
            catch (err) {
				setLoading(false);
				notifyError('signup-failure', err?.error?.message ?? err.message, <IconX size={20} />);
			}
		},
		[router, signUp, setActive]
	);*/

	return (
		<div className='h-screen w-full overflow-x-hidden bg-white px-5 pt-5'>
			<div className='h-full flex justify-center items-center'>
				<SignUp signInUrl='/login' />
			</div>
		</div>
	);
}

export default Signup;
