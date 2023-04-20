import { CourseInfo, ExamBoard, Subject } from './shared-types';

export const SUBJECT_PAPERS: Record<Subject, Record<ExamBoard, Record<string, CourseInfo>>> = {
	maths: {
		edexcel: {
			['pure-maths']: {
				label: 'Pure Maths',
				icon: '/static/images/pure-maths-icon.svg',
				papers: [
					{
						href: 'PM1',
						code: '9MA0/01',
						name: 'Pure Maths 1',
						num_questions: 16,
						marks: 100
					},
					{
						href: 'PM2',
						code: '9MA0/02',
						name: 'Pure Maths 2',
						num_questions: 16,
						marks: 100
					}
				]
			},
			['stats-and-mechanics']: {
				label: 'Statistics & Mechanics',
				icon: '/static/images/statistics-icon.svg',
				papers: [
					{
						href: 'statistics',
						code: '9MA0-31',
						name: 'Statistics',
						num_questions: 5,
						marks: 30
					},
					{
						href: 'mechanics',
						code: '9MA0-32',
						name: 'Mechanics',
						num_questions: 5,
						marks: 50
					}
				]
			}
		},
		aqa: {
			['paper-1']: {
				label: 'Paper 1',
				icon: '/static/images/maths-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '7357/1',
						name: 'Paper 1',
						num_questions: 15,
						marks: 100
					}
				]
			},
			['paper-2']: {
				label: 'Paper 2',
				icon: '/static/images/statistics-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '7357/2',
						name: 'Paper 2',
						num_questions: 19,
						marks: 100
					}
				]
			},
			['paper-3']: {
				label: 'Paper 3',
				icon: '/static/images/statistics-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: '7357/3',
						name: 'Paper 3',
						num_questions: 18,
						marks: 100
					}
				]
			}
		},
		ocr: {
			['maths-a']: {
				label: 'Mathematics - A',
				icon: '/static/images/maths-icon.svg',
				papers: [
					{
						href: 'pure-maths',
						code: 'H240/01',
						name: 'Pure Maths',
						num_questions: 12,
						marks: 100
					},
					{
						href: 'pure-maths-stats',
						code: 'H240/02',
						name: 'Pure Maths and Statistics',
						num_questions: 14,
						marks: 100
					},
					{
						href: 'pure-maths-mechanics',
						code: 'H240/03',
						name: 'Pure Maths and Mechanics',
						num_questions: 14,
						marks: 100
					}
				]
			},
			['maths-b']: {
				label: 'Mathematics - B (MEI)',
				icon: '/static/images/maths-icon.svg',
				papers: [
					{
						href: 'pure-maths-mechanics',
						code: 'H640/01',
						name: 'Pure Maths and Mechanics',
						num_questions: 13,
						marks: 100
					},
					{
						href: 'pure-maths-stats',
						code: 'H640/02',
						name: 'Pure Maths and Statistics',
						num_questions: 16,
						marks: 100
					},
					{
						href: 'pure-maths-comprehension',
						code: 'H640/03',
						name: 'Pure Maths and Comprehension',
						num_questions: 15,
						marks: 75
					}
				]
			}
		}
	},
	economics: {
		edexcel: {
			['economics-a']: {
				label: 'Economics - A',
				icon: '/static/images/economics-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '9EC0/01',
						name: 'Paper 1: Markets and Business Behaviour',
						num_questions: 8,
						marks: 100
					},
					{
						href: 'paper-2',
						code: '9EC0/02',
						name: 'Paper 2: The National and Global Economy',
						num_questions: 8,
						marks: 100
					},
					{
						href: 'paper-3',
						code: '9EC0/03',
						name: 'Paper 3: Microeconomics and Macroeconomics',
						num_questions: 2,
						marks: 100
					}
				]
			},
			['economics-b']: {
				label: 'Economics - B',
				icon: '/static/images/economics-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '9EB0/01',
						name: 'Paper 1: Markets and how they work',
						num_questions: 3,
						marks: 100
					},
					{
						href: 'paper-2',
						code: '9EB0/02',
						name: 'Paper 2: Competing in the global economy',
						num_questions: 3,
						marks: 100
					},
					{
						href: 'paper-3',
						code: '9EB0/03',
						name: 'Paper 3: The economic environment and business',
						num_questions: 2,
						marks: 100
					}
				]
			}
		},
		ocr: {
			microeconomics: {
				label: 'Paper 1',
				icon: '/static/images/microeconomics-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: 'H460/01',
						name: 'Microeconomics',
						num_questions: 5,
						marks: 80
					}
				]
			},
			macroeconomics: {
				label: 'Paper 2',
				icon: '/static/images/macroeconomics-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: 'H460/02',
						name: 'Macroeconomics',
						num_questions: 5,
						marks: 80
					}
				]
			},
			themes: {
				label: 'Paper 3',
				icon: '/static/images/economics-themes-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: 'H460/03',
						name: 'Themes in Economics',
						num_questions: 37,
						marks: 80
					}
				]
			}
		},
		aqa: {
			['markets-and-market-failure']: {
				label: 'Paper 1',
				icon: '/static/images/economics-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '7136/1',
						name: 'Paper 1 - Markets and Market Failure',
						num_questions: 14,
						marks: 80
					}
				]
			},
			['national-and-international-economy']: {
				label: 'Paper 2',
				icon: '/static/images/economics-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '7136/2',
						name: 'Paper 2 - National and International Economics',
						num_questions: 14,
						marks: 80
					}
				]
			},
			['economic-principles-and-issues']: {
				label: 'Paper 3',
				icon: '/static/images/economics-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: '7136/3',
						name: 'Paper 3 - Economic Principles and Issues',
						num_questions: 33,
						marks: 80
					}
				]
			}
		}
	},
	biology: {
		edexcel: {
			['biology-a']: {
				label: 'Biology - A',
				icon: '/static/images/biology-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '9BN0/01',
						name: 'Paper 1 - The Natural Environment and Species Survival',
						num_questions: 10,
						marks: 100
					},
					{
						href: 'paper-2',
						code: '9BN0/02',
						name: 'Paper 2 - Energy, Exercise and Coordination',
						num_questions: 10,
						marks: 100
					},
					{
						href: 'paper-3',
						code: '9BN0/03',
						name: 'Paper 3 – General and Practical Applications in Biology',
						num_questions: 10,
						marks: 100
					}
				]
			},
			['biology-b']: {
				label: 'Biology - B',
				icon: '/static/images/biology-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '9BI0/01',
						name: 'Paper 1 – Advanced Biochemistry, Microbiology and Genetics',
						num_questions: 9,
						marks: 90
					},
					{
						href: 'paper-2',
						code: '9BI0/02',
						name: 'Paper 2 – Advanced Physiology, Evolution and Ecology',
						num_questions: 9,
						marks: 90
					},
					{
						href: 'paper-3',
						code: '9BI0/03',
						name: 'Paper 3 - General and Practical Principals in Biology',
						num_questions: 11,
						marks: 120
					}
				]
			}
		},
		ocr: {
			['biology-a']: {
				label: 'Biology - A',
				icon: '/static/images/biology-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: 'H420/01',
						name: 'Paper 1 - Biological processes',
						num_questions: 21,
						marks: 100
					},
					{
						href: 'paper-2',
						code: 'H420/02',
						name: 'Paper 2 - Biological diversity',
						num_questions: 21,
						marks: 100
					},
					{
						href: 'paper-3',
						code: 'H420/03',
						name: 'Paper 3 - Unified biology',
						num_questions: 5,
						marks: 70
					}
				]
			},
			['biology-b']: {
				label: 'Biology - B (Advanced Biology)',
				icon: '/static/images/biology-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: 'H022/01',
						name: 'Paper 1 - Fundamentals of Biology',
						num_questions: 36,
						marks: 110
					},
					{
						href: 'paper-2',
						code: 'H022/02',
						name: 'Paper 2 - Scientific Literacy in Biology',
						num_questions: 7,
						marks: 100
					},
					{
						href: 'paper-3',
						code: 'H022/03',
						name: 'Paper 3 - Practical Skills in Biology',
						num_questions: 5,
						marks: 60
					}
				]
			}
		},
		aqa: {
			['paper-1']: {
				label: 'Paper 1',
				icon: '/static/images/biology-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '7402/1',
						name: 'Paper 1',
						num_questions: 10,
						marks: 91
					}
				]
			},
			['paper-2']: {
				label: 'Paper 2',
				icon: '/static/images/biology-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '7402/2',
						name: 'Paper 2',
						num_questions: 10,
						marks: 91
					}
				]
			},
			['paper-3']: {
				label: 'Paper 3',
				icon: '/static/images/biology-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: '7402/3',
						name: 'Paper 3',
						num_questions: 7,
						marks: 78
					}
				]
			}
		}
	},
	chemistry: {
		edexcel: {
			['paper-1']: {
				label: 'Paper 1',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '9CH01/01',
						name: 'Paper 1 - Advanced Inorganic and Physical Chemistry',
						num_questions: 9,
						marks: 90
					}
				]
			},
			['paper-2']: {
				label: 'Paper 2',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '9CH02/01',
						name: 'Paper 2 - Advanced Organic and Physical Chemistry',
						num_questions: 12,
						marks: 90
					}
				]
			},
			['paper-3']: {
				label: 'Paper 3',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: '9CH03/01',
						name: 'Paper 3 - General and Practical Principles in Chemistry',
						num_questions: 9,
						marks: 120
					}
				]
			}
		},
		aqa: {
			['paper-1']: {
				label: 'Paper 1',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '7405/1',
						name: 'Paper 1: Advanced Inorganic and Physical Chemistry',
						num_questions: 11,
						marks: 105
					}
				]
			},
			['paper-2']: {
				label: 'Paper 2',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '7405/2',
						name: 'Paper 2: Advanced Organic and Physical Chemistry',
						num_questions: 10,
						marks: 105
					}
				]
			},
			['paper-3']: {
				label: 'Paper 3',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: '7405/3',
						name: 'Paper 3',
						num_questions: 6,
						marks: 90
					}
				]
			}
		},
		ocr: {
			['paper-1']: {
				label: 'Paper 1',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: 'H432/01',
						name: 'Paper 1: Periodic table, elements and physical chemistry',
						num_questions: 22,
						marks: 100
					}
				]
			},
			['paper-2']: {
				label: 'Paper 2',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: 'H432/02',
						name: 'Paper 2: Synthesis and analytical techniques',
						num_questions: 21,
						marks: 100
					}
				]
			},
			['paper-3']: {
				label: 'Paper 3',
				icon: '/static/images/chemistry-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: 'H432/03',
						name: 'Paper 3: Unified chemistry',
						num_questions: 5,
						marks: 70
					}
				]
			}
		}
	},
	physics: {
		aqa: {
			['paper-1']: {
				label: 'Paper 1',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '7408/1',
						name: 'Paper 1',
						num_questions: 30,
						marks: 85
					}
				]
			},
			['paper-2']: {
				label: 'Paper 2',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '7408/2',
						name: 'Paper 2',
						num_questions: 31,
						marks: 85
					}
				]
			},
			['paper-3A']: {
				label: 'Paper 3A',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-3A',
						code: '7408/3A',
						name: 'Paper 3A',
						num_questions: 30,
						marks: 85
					}
				]
			},
			['paper-3B']: {
				label: 'Paper 3B',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-3B',
						code: '7408/3BA',
						name: 'Paper 3B Option A (Astrophysics)',
						num_questions: 3,
						marks: 45
					},
					{
						href: 'paper-3B',
						code: '7408/3BB',
						name: 'Paper 3 Option B (Medical Physics)',
						num_questions: 5,
						marks: 35
					},
					{
						href: 'paper-3B',
						code: '7408/3BC',
						name: 'Paper 3 Option C (Engineering Physics)',
						num_questions: 5,
						marks: 35
					},
					{
						href: 'paper-3B',
						code: '7408/3BD',
						name: 'Paper 3 Option D (Turing Points in Physics)',
						num_questions: 4,
						marks: 35
					},
					{
						href: 'paper-3B',
						code: '7408/3BE',
						name: 'Paper 3 Option E (Electronics)',
						num_questions: 5,
						marks: 35
					}
				]
			}
		},
		ocr: {
			physics_a: {
				label: 'Physics A',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: 'H556/01',
						name: 'Modelling Physics',
						num_questions: 24,
						marks: 100
					},
					{
						href: 'paper-2',
						code: 'H556/02',
						name: 'Exploring Physics',
						num_questions: 25,
						marks: 100
					},
					{
						href: 'paper-3',
						code: 'H556/03',
						name: 'Unified Physics',
						num_questions: 6,
						marks: 70
					}
				]
			},
			physics_b: {
				label: 'Physics B (Advanced Physics)',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: 'H557/01',
						name: 'Fundamentals of Physics',
						num_questions: 41,
						marks: 110
					},
					{
						href: 'paper-2',
						code: 'H557/02',
						name: 'Scientific Literacy in Physics',
						num_questions: 10,
						marks: 100
					},
					{
						href: 'paper-3',
						code: 'H557/03',
						name: 'Practical Skills in Physics',
						num_questions: 4,
						marks: 60
					}
				]
			}
		},
		edexcel: {
			paper_1: {
				label: 'Paper 1',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '9PH01/01',
						name: 'Paper 1',
						num_questions: 17,
						marks: 90
					}
				]
			},
			paper_2: {
				label: 'Paper 2',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '9PH02/01',
						name: 'Paper 2',
						num_questions: 20,
						marks: 90
					}
				]
			},
			paper_3: {
				label: 'Paper 3',
				icon: '/static/images/physics-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: '9PH03/01',
						name: 'Paper 3',
						num_questions: 13,
						marks: 120
					}
				]
			}
		}
	},
	psychology: {
		edexcel: {
			['foundations-in-psychology']: {
				label: 'Unit 1',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '9PS0/01',
						name: 'Unit 1: Foundations in Psychology',
						num_questions: 13,
						marks: 90
					}
				]
			},
			['applications-of-psychology']: {
				label: 'Unit 2',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '9PS0/02',
						name: 'Unit 2: Applications of Psychology',
						num_questions: 18,
						marks: 90
					}
				]
			},
			['psychological-skills']: {
				label: 'Unit 3',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: '9PS0/03',
						name: 'Unit 3: Psychological Skills',
						num_questions: 6,
						marks: 80
					}
				]
			}
		},
		aqa: {
			['introductory-topics-in-psychology']: {
				label: 'Paper 1',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: '7182/1',
						name: 'Paper 1: Introductory Topics in Psychology',
						num_questions: 18,
						marks: 96
					}
				]
			},
			['psychology-in-context']: {
				label: 'Paper 2',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: '7182/2',
						name: 'Paper 2: Psychology in Context',
						num_questions: 25,
						marks: 96
					}
				]
			},
			['issues-and-options-in-psychology']: {
				label: 'Paper 3',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: '7182/3',
						name: 'Paper 3: Issues and options in Psychology',
						num_questions: 39,
						marks: 96
					}
				]
			}
		},
		ocr: {
			['research-methods']: {
				label: 'Paper 1',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-1',
						code: 'H567/01',
						name: 'Research Methods',
						num_questions: 31,
						marks: 90
					}
				]
			},
			['psychological-themes']: {
				label: 'Paper 2',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-2',
						code: 'H567/02',
						name: 'Psychological themes through Core Studies ',
						num_questions: 12,
						marks: 105
					}
				]
			},
			['applied-psychology']: {
				label: 'Paper 3',
				icon: '/static/images/psychology-icon.svg',
				papers: [
					{
						href: 'paper-3',
						code: 'H567/03',
						name: 'Applied Psychology',
						num_questions: 8,
						marks: 105
					}
				]
			}
		}
	}
};

export const SNEAK_PEAK_QUESTION_ANSWERS = {
	['maths']: [
		{
			question: 'Using the binomial theorem, expand (x + y)^4.',
			answer: 'The binomial theorem states that (x + y)^n = C(n,0)x^n y^0 + C(n,1)x^(n-1) y^1 + ... + C(n,k)x^(n-k) y^k + ... + C(n,n)x^0 y^n, where C(n,k) is the binomial coefficient. Applying this to (x + y)^4 gives:\n' +
				'(x + y)^4 = C(4,0)x^4 y^0 + C(4,1)x^3 y^1 + C(4,2)x^2 y^2 + C(4,3)x y^3 + C(4,4)x^0 y^4\n' +
				'= x^4 + 4x^3 y + 6x^2 y^2 + 4xy^3 + y^4\n' +
				'\n' +
				'Therefore, (x + y)^4 expands to x^4 + 4x^3 y + 6x^2 y^2 + 4xy^3 + y^4.',
			chance: 91
		},
		{
			question: 'Solve the quadratic equation 2x^2 + 3x - 2 = 0',
			answer: 'x = (-b ± sqrt(b^2 - 4ac)) / 2a\n' +
				'\n' +
				'In this case, a = 2, b = 3, and c = -2. Substituting these values into the quadratic formula gives:\n' +
				'\n' +
				'x = (-3 ± sqrt(3^2 - 4(2)(-2))) / 2(2)\n' +
				'= (-3 ± sqrt(25)) / 4\n' +
				'\n' +
				'Simplifying, we get:\n' +
				'\n' +
				'x = (-3 + 5) / 4 or x = (-3 - 5) / 4\n' +
				'= 1/2 or -2\n' +
				'\n' +
				'Therefore, the solutions to the quadratic equation 2x^2 + 3x - 2 = 0 are x = 1/2 and x = -2.',
			chance: 86
		}
	],
	['psychology']: [
		{
			question:
				'To what extent can correlational research establish cause and effect relationships between variables?',
			answer: 'Correlational research is a useful tool in psychology as it allows researchers to identify relationships between variables. However, it is important to note that correlational research does not establish cause and effect relationships between variables. This is because correlational research measures the degree to which variables are related to each other, but it does not manipulate variables. Therefore, it is possible that other factors may be responsible for the observed relationship between variables.',
			chance: 89
		},
		{
			question:
				'Discuss the ethical considerations that researchers need to take into account when conducting research with human participants.',
			answer: 'Ethical considerations are an important aspect of psychological research, particularly when conducting research with human participants. Researchers must ensure that their studies do not harm participants physically or psychologically, and that participants are fully informed about the nature of the research and their rights as participants. Informed consent is an essential requirement of ethical research, and researchers must obtain written consent from participants before they can take part in the study. ',
			chance: 90
		}
	],
	['biology']: [
		{
			question: 'Discuss the role of enzymes in biological systems and explain how enzyme activity is regulated.',
			answer: 'Enzymes are biological catalysts that speed up the rate of chemical reactions in living organisms. They are usually proteins and have a unique three-dimensional shape that allows them to catalyze specific reactions. Enzymes play a critical role in many biological processes, including digestion, metabolism, and DNA replication.',
			chance: 92
		},
		{
			question: ' Explain the process of mitosis and its importance in cell division',
			answer:
				'Mitosis is the process of cell division that results in two identical daughter cells, each with the same number of chromosomes as the parent cell. It is divided into four stages: prophase, metaphase, anaphase, and telophase.\n' +
				'\n' +
				'During prophase, the chromatin in the nucleus condenses into visible chromosomes, each consisting of two identical sister chromatids joined at a centromere. The spindle fibers also begin to form, attaching to the chromosomes at the kinetochore.',
			chance: 85
		}
	],
	['chemistry']: [
		{
			question:
				'Discuss the factors that affect the rate of a chemical reaction, and explain how they influence the rate.',
			answer:
				'The rate of a chemical reaction is affected by several factors, including temperature, concentration, surface area, and the presence of a catalyst.\n' +
				'\n' +
				'Temperature: Increasing the temperature increases the kinetic energy of the reactant particles, causing them to collide more frequently and with greater energy, leading to an increase in the rate of the reaction. Surface area: Increasing the surface area of a solid reactant increases the number of exposed particles, leading to more frequent collisions and a higher reaction rate.',
			chance: 79
		},
		{
			question: 'Discuss the properties and uses of polymers, with reference to specific examples',
			answer:
				'Polymers are large molecules made up of repeating units called monomers. They can be natural or synthetic and have a wide range of properties and uses.\n' +
				'\n' +
				'Some properties of polymers include their high molecular weight, low density, flexibility, and resistance to degradation. These properties make them useful in a variety of applications, such as packaging, textiles, and construction materials.',
			chance: 82
		}
	],
	physics: [
		{
			question: 'Explain the concept of electric potential and its relationship to electric field strength.',
			answer:
				'Electric potential is the amount of work required per unit charge to move a positive test charge from infinity to a specific point in an electric field. It is often measured in volts (V) and is denoted by the symbol V. The electric potential at a point in an electric field is determined by the electric field strength at that point and the distance of the point from the source charge. The relationship between electric potential and electric field strength is given by the equation:\n' +
				'\n' +
				'V = -Ed' +
				'\n' +
				'where V is the electric potential, E is the electric field strength, and d is the distance between the point and the source charge.',
			chance: 92
		},
		{
			question: 'Discuss the principles of wave-particle duality and its implications in modern physics.',
			answer: 'Wave-particle duality is the concept that particles can exhibit both wave-like and particle-like behavior. This principle was first observed in the early 20th century during experiments involving the behavior of electrons and other subatomic particles. According to wave-particle duality, subatomic particles can exhibit wave-like properties, such as interference and diffraction, as well as particle-like properties, such as having a definite position and momentum. The behavior of subatomic particles is described by the wave function, which gives the probability of finding the particle at a particular point in space.',
			chance: 89
		}
	],
	economics: [
		{
			question:
				'Use demand and supply analysis to explain how the equilibrium price and quantity of a good will change when there is an increase in production costs.',
			answer: 'When there is an increase in production costs, the supply curve shifts to the left. This is because producers will need to charge a higher price in order to cover their increased costs. As a result, the equilibrium price will increase, and the equilibrium quantity will decrease. This is shown graphically as a leftward shift in the supply curve, and a movement along the demand curve to a higher price and lower quantity. The new equilibrium will have a higher price and a lower quantity than the original equilibrium.',
			chance: 86
		},
		{
			question: 'Using the concept of price elasticity of demand, explain why the demand for cigarettes is likely to be more elastic in the long run than in the short run.',
			answer: 'The demand for cigarettes is likely to be more elastic in the long run than in the short run because in the short run, consumers have fewer options and are less able to adjust their behavior in response to changes in price. In the short run, smokers may be addicted to cigarettes or have a habit of smoking that is difficult to break, which makes them less responsive to changes in price. However, in the long run, consumers have more time to adjust their behavior, such as by quitting smoking or switching to a cheaper brand. As a result, the demand for cigarettes is likely to be more elastic in the long run, meaning that a change in price will have a larger effect on the quantity demanded.',
			chance: 94
		}
	]
};
