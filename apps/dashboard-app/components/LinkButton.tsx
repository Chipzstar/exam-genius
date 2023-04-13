import React from 'react';
import { Box, Button, MantineSize, Sx, Text } from '@mantine/core';
import Link from 'next/link';

interface Props {
	href: string;
	text: string;
	size?: MantineSize;
	width?: number;
	type?: 'button' | 'submit';
	disabled?: boolean;
	styles?: Sx;
}

const LinkButton = ({ href, disabled = false, width = 140, text, size="xl", type="button", styles }: Props) => {
	return disabled ? (
		<Box w={width} sx={styles}>
			<Button fullWidth size={size} disabled>
				<Text>{text}</Text>
			</Button>
		</Box>
	) : (
		<Link href={href} passHref>
			<Box w={width}>
				<Button type={type} fullWidth size={size}>
					<Text>{text}</Text>
				</Button>
			</Box>
		</Link>
	);
};

export default LinkButton;
