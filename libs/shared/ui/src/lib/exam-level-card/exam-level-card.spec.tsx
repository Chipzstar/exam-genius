import { render } from '@testing-library/react';

import ExamLevelCard from './exam-level-card';

describe('ExamLevelCard', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<ExamLevelCard value='a_level' src='' />);
		expect(baseElement).toBeTruthy();
	});
});
