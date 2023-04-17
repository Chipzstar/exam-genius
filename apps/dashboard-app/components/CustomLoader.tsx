import React from 'react';
import { DEFAULT_THEME, Stack, Text } from '@mantine/core';

export interface LoadingOverlayProps {
	text: string;
	subText?: string;
}

export function CustomLoader(props: LoadingOverlayProps) {
	return (
		<div className="flex flex-col justify-center items-center space-y-2">
			<svg width='54' height='54' viewBox='0 0 38 38' xmlns='http://www.w3.org/2000/svg' stroke={DEFAULT_THEME.colors.blue[6]}>
				<g fill='none' fillRule='evenodd'>
					<g transform='translate(1 1)' strokeWidth='2'>
						<circle strokeOpacity='.5' cx='18' cy='18' r='18' />
						<path d='M36 18c0-9.94-8.06-18-18-18'>
							<animateTransform attributeName='transform' type='rotate' from='0 18 18' to='360 18 18' dur='1s' repeatCount='indefinite' />
						</path>
					</g>
				</g>
			</svg>
			<Stack justify="center" align="center">
				<Text align="center" size="xl" weight={600}>{props.text}</Text>
				{props.subText && <Text align="center" size="sm">{props.subText}</Text>}
			</Stack>
		</div>
	);
}

export default CustomLoader;
