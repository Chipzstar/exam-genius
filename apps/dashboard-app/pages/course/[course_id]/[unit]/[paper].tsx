import {
	Button,
	Card,
	createStyles,
	getStylesRef,
	LoadingOverlay,
	ScrollArea,
	Space,
	Stack,
	Text,
	Title
} from '@mantine/core';
import Page from '../../../../layout/Page';
import React, { useCallback, useState } from 'react';
import { useTimeout, useViewportSize } from '@mantine/hooks';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { trpc } from '../../../../utils/trpc';
import parse from 'html-react-parser';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Carousel } from '@mantine/carousel';
import CustomLoader from '../../../../components/CustomLoader';
import { PATHS } from '../../../../utils/constants';
import { ExamBoard, Subject, SUBJECT_PAPERS } from '@exam-genius/shared/utils';
import { notifyError } from '../../../../utils/functions';
import { TRPCError } from '@trpc/server';

export interface PageQuery extends ParsedUrlQuery {
	subject: Subject;
	board: ExamBoard;
	course_id: string;
	code: string;
	unit: string;
	paper: string;
}

export const getServerSideProps: GetServerSideProps<{ query: PageQuery }> = async context => {
	const query = context.query as PageQuery;
	return {
		props: {
			query
		}
	};
};

const useStyles = createStyles(() => ({
	controls: {
		ref: getStylesRef('controls'),
		transition: 'opacity 150ms ease',
		opacity: 0
	},
	root: {
		'&:hover': {
			[`& .${getStylesRef('controls')}`]: {
				opacity: 1
			}
		}
	}
}));

const NoPapers = ({ query, start }: { query: PageQuery; start: (...callbackParams: any[]) => void }) => {
	const [loading, setLoading] = useState(false);
	const { mutateAsync: createPastPaper } = trpc.paper.createPaper.useMutation();

	const generatePaper = useCallback(async () => {
		setLoading(true)
		const paper = SUBJECT_PAPERS[query.subject][query.board][query.unit].papers.find(p => p.code === query.code);
		if (!paper) throw new Error('No paper found with paper code ' + query.code);
		try {
			const created_paper = await createPastPaper({
				paper_name: paper.name,
				paper_code: query.code,
				course_id: query.course_id,
				subject: query.subject,
				exam_board: query.board,
				unit_name: query.unit,
				num_questions: paper.num_questions,
				num_marks: paper.marks
			});
			setLoading(false);
			console.log(created_paper.paper_id);
			start(created_paper.paper_id);
		} catch (err) {
			console.error(err);
			notifyError('generate-paper-failed', err.message, <IconX size={20} />);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	}, [query, start]);

	return (
		<div className='flex h-full flex-col items-center justify-center space-y-12'>
			<Stack align='center'>
				<Title order={1}>You have no papers for this course</Title>
				<Text color='dimmed' size='sm'>
					Click below to generate a new paper
				</Text>
			</Stack>
			<Button size='xl' onClick={() => generatePaper()} loading={loading}>
				Generate Paper
			</Button>
		</div>
	);
};

const Paper = ({ query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { classes } = useStyles();
	const [regenerate, setRegenerate] = useState(false);
	const router = useRouter();
	const { isLoading, data: papers } = trpc.paper.getPapersByCode.useQuery(
		{ courseId: query.course_id, code: query.code },
		{ initialData: [], refetchInterval: 3000 }
	);
	const { mutateAsync: checkPaperGenerated } = trpc.paper.checkPaperGenerated.useMutation();
	const { height } = useViewportSize();
	const { start, clear } = useTimeout((id: string) => {
		checkPaperGenerated({ id }).then(isGenerated => {
			if (!isGenerated) {
				setRegenerate(true);
			}
		});
	}, 60000);

	return (
		<Page.Container>
			<header className='jusitfy-end flex items-center p-6'>
				<Button
					leftIcon={<IconArrowLeft />}
					size='md'
					variant='outline'
					onClick={() =>
						router.replace(
							`${PATHS.COURSE}/${query.course_id}/${query.unit}?subject=${query.subject}&board=${query.board}`
						)
					}
				>
					Back
				</Button>
			</header>
			<Page.Body extraClassNames='justify-center w-full'>
				{isLoading ? (
					<LoadingOverlay visible={isLoading} overlayBlur={2} />
				) : !papers.length ? (
					<NoPapers query={query} start={start} />
				) : (
					<Carousel mx='auto' classNames={classes} controlsOffset='xl'>
						{papers.map((paper, index) => (
							<Carousel.Slide key={index}>
								<ScrollArea.Autosize
									mah={height - 200}
									p='sm'
									styles={theme => ({
										root: {}
									})}
								>
									<Card shadow='sm' radius='md' className='w-full' p='xl' mih={height - 300}>
										<div className='flex justify-center'>
											<Stack justify='center' align='center'>
												<Title color='brand'>ExamGenius</Title>
												{paper.name && (
													<Text size={30} weight={600}>
														{paper.name}
													</Text>
												)}
												<Text size='lg'>AI Predicted Paper</Text>
											</Stack>
										</div>
										<Space h='xl' />
										<div className='h-full px-6 py-2'>
											{/*<ol type='1'>
								<li>For the function f(x) = x^3 - 9x^2 + 14x - 6, find:</li>
								<ol type='a'>
									<li>The values of x for which f(x) = 0.</li>
									<li>The nature of the stationary points.</li>
									<li>
										The equation of the tangent to the curve at the stationary point with
										x-coordinate 1.
									</li>
								</ol>
								<li>
									Let f(x) = 2x^3 - 9x^2 + 12x - 3. Show that the equation f(x) = 0 has exactly one
									root between 0 and 1.
								</li>
								<li>
									A geometric progression has first term a and common ratio r, where a {'>'} 0 and r{' '}
									{'>'} 0. The sum of the first three terms of the progression is 11 times the third
									term. Find the possible values of r, giving your answer in the form p/q where p and
									q are integers.
								</li>
								<li>Find the value of x in the equation log(base 3) [(2x+1)/(3x-7)] = 2.</li>
								<li>
									The points A, B and C have position vectors a = i + 3j - 2k, b = 2i - j + 3k and c =
									3i + j - k respectively. Calculate the volume of the parallelepiped with adjacent
									sides AB, AC and BC.
								</li>
								<li>
									A function f is defined by f(x) = 2x^3 - 9x^2 + 12x - 3, x {'<'} 0, and f(x) = a(ln
									x + b)^3 + c, x {'>'}= 0. Given that f is continuous at x = 0, find the values of a,
									b and c.
								</li>
								<li>For the matrix A = [1 -1 2; 0 1 -1; -1 2 3], find:</li>
								<ol type='a'>
									<li>The inverse of A.</li>
									<li>The determinant of A^T.</li>
									<li>The eigenvalues of A.</li>
								</ol>
								<li>
									Find the value of the constant k such that the line y = 2x + k is a tangent to the
									curve y = 4x - x^3 at exactly one point and find this point.
								</li>
								<li>Show that the equation x^3 + 3x^2 + x - 5 = 0 has exactly one real root.</li>
								<li>
									The function f is defined by f(x) = e^(-x) - x. Use the iterative formula x(n+1) =
									e^(-x(n)) to find the root of f correct to 3 decimal places, given that x(0) = 1.
								</li>
								<li>
									Find the area enclosed by the curve y = x^3 - 6x^2 - x + 30 and the x-axis, giving
									your answer to three significant figures.
								</li>
								<li>
									Prove that the differential equation dy/dx = (x^2 - y^2)/(2xy) has a particular
									solution y = 1/x when x {'>'} 0.
								</li>
								<li>
									A curve has equation y = x + 3/x. Find the coordinates of the point(s) on the curve
									at which the tangent is parallel to the x-axis.
								</li>
								<li>
									A particle moves with velocity v m/s, where v = (t+1)e^(2-t) for 0 {'<'}= t {'<'}=
									2. Find the maximum acceleration of the particle correct to 3 decimal places.
								</li>
								<li>
									The function f is defined by f(x) = x - 4cos(x), where x is measured in radians. Use
									the Newton-Raphson method to find the root of f in the interval [3, 4], correct to 3
									decimal places.
								</li>
								<li>The matrix A has eigenvalues 2, -1 and 4. Given that A^T = A^(-1), find:</li>
								<ol type='a'>
									<li>The determinant of A.</li>
									<li>The inverse of A.</li>
									<li>The values of x and y if A has the form [x y 0; 0 x y; 0 0 z].</li>
								</ol>
							</ol>*/}
											{paper.content || paper.status === 'success' ? (
												parse(paper.content, { trim: true })
											) : (
												<>
													<CustomLoader
														text='Generating Paper'
														subText='Approx waiting time is 20 to 60 seconds. Go grab a coffee while we get your paper ready '
													/>
													{regenerate && (
														<div className='flex flex-col items-center'>
															<Title order={3}>
																After 2 minutes if no paper is generated, click “here
															</Title>
															<Button
																size='xl'
																onClick={() => alert("Regenerating paper")}
															>
																Regenerate
															</Button>
														</div>
													)}
												</>
											)}
										</div>
									</Card>
								</ScrollArea.Autosize>
							</Carousel.Slide>
						))}
					</Carousel>
				)}
			</Page.Body>
		</Page.Container>
	);
};

export default Paper;
