import { render } from '@testing-library/react';

import SubjectCard from './subject-card';

describe('SubjectCard', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<SubjectCard subject='' src='' />);
		expect(baseElement).toBeTruthy();
	});
});
