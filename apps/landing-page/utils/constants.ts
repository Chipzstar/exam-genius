export const DEFAULT_HEADER_HEIGHT = 75

export interface Review {
	author: string;
	age: number;
	year: number;
	image: string | null;
	review: string;
}

export const reviews: Review[] = [
	{
		author: 'Posi',
		age: 17,
		year: 12,
		image: '/static/images/posi.svg',
		review: 'I was skeptical at first, but ExamGenius exceeded my expectations. The predicted papers were spot on and helped me identify my weak areas and focus my studies.'
	},
	{
		author: 'Sarah',
		age: 18,
		year: 13,
		image: '/static/images/sarah.svg',
		review: 'Their predicted papers and detailed answers helped me feel confident and well-prepared for my A-level exams. Thanks to ExamGenius, I was able to achieve the grades I needed to get into my dream university.'
	},
	{
		author: 'Emily',
        age: 18,
        year: 13,
		image: '/static/images/emily.svg',
        review: 'Using ExamGenius was a no-brainer for me. The convenience of having all the predicted papers in one place, along with the detailed answers and explanations, made studying for my exams much easier and less stressful.'
	},
	{
		author: 'Ruby',
        age: 17,
        year: 12,
		image: null,
        review: 'ExamGenius made it easy for me to prepare with their AI-generated predicted exam papers. Thanks to ExamGenius, I was able to gain confidence and achieve the results I wanted.',
	},
	{
		author: 'Alex',
        age: 18,
        year: 13,
		image: '/static/images/alex.svg',
        review: 'As someone who struggles with test anxiety, ExamGenius was a lifesaver for me. The predicted papers gave me the confidence I needed to walk into my exams feeling prepared and ready to succeed.'
	},
	{
		author: 'Maria',
        age: 18,
        year: 13,
		image: '/static/images/maria.svg',
        review: 'ExamGenius was the best investment I made during my A-level studies. The predicted papers were incredibly accurate, and the detailed explanations helped me understand where I was going wrong. '
	}
];
