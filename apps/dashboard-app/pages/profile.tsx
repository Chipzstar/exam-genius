import React from 'react';
import Page from '../layout/Page';
import { UserProfile } from '@clerk/nextjs';
import { ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

const Profile = () => {
	const { height, width } = useViewportSize();
	return (
		<Page.Container extraClassNames='justify-center items-center w-full'>
			<ScrollArea.Autosize
				mah={height - 100}
				p='xl'
				styles={theme => ({
					root: {
						padding: theme.spacing.xl
					},
					viewport: {
						padding: theme.spacing.xl,
					}
				})}
			>
				<UserProfile
					appearance={{
						layout: {
							showOptionalFields: true
						},
						elements: {
							profilePage: {
								border: 'px solid red'
							},
							profileSection__activeDevices: {
								display: 'none'
							}
						}
					}}
				/>
			</ScrollArea.Autosize>
		</Page.Container>
	);
};

export default Profile;
