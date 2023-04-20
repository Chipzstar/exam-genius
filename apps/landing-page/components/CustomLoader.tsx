import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../animations/lf30_34lFTw.json';
import { Modal, Stack, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const CustomLoader = ({ opened, onClose, text }) => {
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const theme = useMantineTheme();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice'
		}
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			centered
			size='md'
			overlayProps={{
				color: theme.colors.gray[2],
				opacity: 0.55,
				blur: 3
			}}
		>
			<Stack justify='center'>
				<Title align='center' color='brand' weight={600} size='xl' px='lg'>
					{text}
				</Title>
				<Lottie options={defaultOptions} height={mobileScreen ? 200 : 400} width={mobileScreen ? 200 : 400} />
			</Stack>
		</Modal>
	);
};

export default CustomLoader;
