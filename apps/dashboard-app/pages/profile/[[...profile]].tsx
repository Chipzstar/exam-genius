import React from 'react';
import Page from '../../layout/Page';
import { UserProfile } from '@clerk/nextjs';
import { ScrollArea } from '@mantine/core';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';

const Profile = () => {
	const { height, width } = useViewportSize();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	return (
		<Page.Container extraClassNames='sm:justify-center items-center w-full'>
			<ScrollArea.Autosize
				mah={{ base: height, sm: height - 100 }}
				p={{ base: 0, sm: 'xl' }}
				styles={theme => ({
					root: {
						padding: mobileScreen ? `${theme.spacing.xs} 0` : theme.spacing.xl
					},
					viewport: {
						padding: mobileScreen ? `${theme.spacing.xs} 0` : theme.spacing.xl
					}
				})}
			>
				<UserProfile
					appearance={{
						layout: {
							showOptionalFields: true
						},
						elements: {
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
