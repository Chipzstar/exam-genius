import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../app/page';
import { Providers } from '../app/providers';

describe('HomePage', () => {
	it('should render successfully', () => {
		const { baseElement } = render(
			<Providers>
				<HomePage />
			</Providers>
		);
		expect(baseElement).toBeTruthy();
	});
});
