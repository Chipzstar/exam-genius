export const DEFAULT_HEADER_HEIGHT = 75

export interface Review {
	author: string;
	age: number;
	subject: string;
	image: string | null;
	review: string;
}

export const reviews: Review[] = [
	{
		author: 'Rachel',
		age: 17,
		subject: 'Physics',
		image: '/static/images/posi.svg',
		review: 'ExamGenius test papers were incredibly elaborate as they covered a range of difficulties throughout the paper which helped me prepare for my examinations as i find doing past papers and exam questions are a really resourceful way to revise for my physics A level.'
	},
	{
		author: 'Posi',
		age: 17,
		subject: 'Maths',
		image: '/static/images/sarah.svg',
		review: 'The exam papers are realistic and well structured. I realised that it not only looks at the trends in past maths papers, but also looks at what hasn’t come up. This makes me very confident & prepared for all A level exams and tests.'
	},
	{
		author: 'Arehone',
        age: 17,
        subject: 'Biology',
		image: '/static/images/emily.svg',
        review: 'ExamGenius strengthened my biology knowledge by filling gaps, including cell cycle and mitosis, using subject-specific terminology. Its wide range of questions boosted my confidence, leading to my academic success.Without it I wouldn’t have been able to achieve the grades that I have today'
	},
	{
		author: 'Ruby',
        age: 17,
        subject: 'Psychology',
		image: '/static/images/maria.svg',
        review: 'ExamGenius improved my understanding of psychology topics I struggled with, including approaches and social influences. Its AI-generated exam questions replicate exam style and language, aiding my practice and familiarity with exam format.',
	},
	{
		author: 'Arehone',
        age: 17,
        subject: 'Chemistry',
		image: '/static/images/emily.svg',
        review: 'ExamGenius helped me understand A-level Chemistry, including organic chemistry and enthalpy change, by breaking down complex topics and providing exam-style questions to solidify my understanding. Improved my grade from C to A in year 13.'
	},
	{
		author: 'Ruby',
        age: 17,
        subject: 'Economics',
		image: '/static/images/maria.svg',
        review: 'EExamGenius improved my confidence in economics by providing exam-style questions and aiding my identification of key words.It has allowed me to answer questions without having to spend endless hours looking for economics questions as they are all in one place.'
	}
];
