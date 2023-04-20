import { render } from '@testing-library/react';

import ExamBoardCard from './exam-board-card';

describe('ExamBoardCard', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<ExamBoardCard src='' value='' />);
		expect(baseElement).toBeTruthy();
	});
});
