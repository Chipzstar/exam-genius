export {
	SUBJECT_PAPERS,
	SUBJECT_PAPERS_A_LEVEL,
	SUBJECT_PAPERS_AS_LEVEL,
	SUBJECT_PAPERS_BY_LEVEL,
	getSubjectPapersCatalog,
	type SubjectPapersCatalog
} from './subject-papers-catalog';

export const SNEAK_PEAK_QUESTION_ANSWERS = {
	['maths']: [
		{
			question: "<span>Given that f(x) = x<sup>2</sup> - 1, find the values of x for which f(x+2) = f(x-2)</span>",
			answer:
				"<p> f(x+2) = (x+2)<sup>2</sup> - 1 <br>\n" +
				"&nbsp; &nbsp; &nbsp; &nbsp; = x<sup>2</sup> - 4x + 3 </p>\n" +
				"<p> Now, we can equate the two expressions and solve for x: </p>\n" +
				"<p> x<sup>2</sup> + 4x + 3 = x<sup>2</sup> - 4x + 3 </p>\n" +
				"<p> Simplifying, we get: </p>\n" +
				"<p> 8x = 0 <span>Therefore, x = 0. </span></p>",
			chance: 91
		},
		{
			question:
				'<span>Simplify 2(cos(<i>x</i>)<sup>2</sup> - sin(<i>x</i>)<sup>2</sup>) - (cos(<i>x</i>)<sup>2</sup> +\n' +
				'        sin(<i>x</i>)<sup>2</sup>)</span>',
			answer:
				"<p> To simplify this expression, we can use the trigonometric identity: </p>\n" +
				"<p> cos<sup>2</sup>(x) + sin<sup>2</sup>(x) = 1 </p>\n" +
				"<p> 2(cos<sup>2</sup>(x) - sin<sup>2</sup>(x)) - (cos<sup>2</sup>(x) + sin<sup>2</sup>(x)) </p>\n" +
				"<p> = 2cos<sup>2</sup>(x) - 2sin<sup>2</sup>(x) - cos<sup>2</sup>(x) - sin<sup>2</sup>(x) </p>\n" +
				"<p> = cos<sup>2</sup>(x) - 2sin<sup>2</sup>(x) </p>\n" +
				"<p> Now, we can use the identity: sin<sup>2</sup>(x) = 1 - cos<sup>2</sup>(x) </p>\n" +
				"<p> Substituting this into the expression, we get: </p>\n" +
				"<p> cos<sup>2</sup>(x) - 2(1 - cos<sup>2</sup>(x)) </p>\n" +
				"<p> = cos<sup>2</sup>(x) - 2 + 2cos<sup>2</sup>(x) </p>\n" +
				"<p> = 3cos<sup>2</sup>(x) - 2 </p>",
			chance: 86
		}
	],
	['psychology']: [
		{
			question:
				'To what extent can correlational research establish cause and effect relationships between variables?',
			answer:
				'Correlational research is a useful tool in psychology as it allows researchers to identify relationships between variables. However, it is important to note that correlational research does not establish cause and effect relationships between variables. This is because correlational research measures the degree to which variables are related to each other, but it does not manipulate variables. Therefore, it is possible that other factors may be responsible for the observed relationship between variables.',
			chance: 89
		},
		{
			question:
				'Discuss the ethical considerations that researchers need to take into account when conducting research with human participants.',
			answer:
				'Ethical considerations are an important aspect of psychological research, particularly when conducting research with human participants. Researchers must ensure that their studies do not harm participants physically or psychologically, and that participants are fully informed about the nature of the research and their rights as participants. Informed consent is an essential requirement of ethical research, and researchers must obtain written consent from participants before they can take part in the study. ',
			chance: 90
		}
	],
	['biology']: [
		{
			question: 'Discuss the role of enzymes in biological systems and explain how enzyme activity is regulated.',
			answer:
				'Enzymes are biological catalysts that speed up the rate of chemical reactions in living organisms. They are usually proteins and have a unique three-dimensional shape that allows them to catalyze specific reactions. Enzymes play a critical role in many biological processes, including digestion, metabolism, and DNA replication.',
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
			answer:
				'Wave-particle duality is the concept that particles can exhibit both wave-like and particle-like behavior. This principle was first observed in the early 20th century during experiments involving the behavior of electrons and other subatomic particles. According to wave-particle duality, subatomic particles can exhibit wave-like properties, such as interference and diffraction, as well as particle-like properties, such as having a definite position and momentum. The behavior of subatomic particles is described by the wave function, which gives the probability of finding the particle at a particular point in space.',
			chance: 89
		}
	],
	economics: [
		{
			question:
				'Use demand and supply analysis to explain how the equilibrium price and quantity of a good will change when there is an increase in production costs.',
			answer:
				'When there is an increase in production costs, the supply curve shifts to the left. This is because producers will need to charge a higher price in order to cover their increased costs. As a result, the equilibrium price will increase, and the equilibrium quantity will decrease. This is shown graphically as a leftward shift in the supply curve, and a movement along the demand curve to a higher price and lower quantity. The new equilibrium will have a higher price and a lower quantity than the original equilibrium.',
			chance: 86
		},
		{
			question:
				'Using the concept of price elasticity of demand, explain why the demand for cigarettes is likely to be more elastic in the long run than in the short run.',
			answer:
				'The demand for cigarettes is likely to be more elastic in the long run than in the short run because in the short run, consumers have fewer options and are less able to adjust their behavior in response to changes in price. In the short run, smokers may be addicted to cigarettes or have a habit of smoking that is difficult to break, which makes them less responsive to changes in price. However, in the long run, consumers have more time to adjust their behavior, such as by quitting smoking or switching to a cheaper brand. As a result, the demand for cigarettes is likely to be more elastic in the long run, meaning that a change in price will have a larger effect on the quantity demanded.',
			chance: 94
		}
	]
};
