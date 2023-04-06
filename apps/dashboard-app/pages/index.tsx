import { Button } from '@mantine/core';
import Page from '../layout/Page';
import { useClerk } from '@clerk/nextjs';

export function Home() {
	const { signOut } = useClerk();
	return (
		<Page.Container>
			<Page.Body>
				<div className="flex h-full justify-center items-center">
					<Button size='xl' onClick={() => signOut()}>
						Sign Out
					</Button>
				</div>
			</Page.Body>
		</Page.Container>
	);
}

export default Home;
