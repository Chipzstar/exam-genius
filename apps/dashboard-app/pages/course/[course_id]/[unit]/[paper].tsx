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

interface RegeneratePayload {
	id: string;
	num_questions: number;
	num_marks: number;
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

const NoPapers = ({ query, start }: { query: PageQuery; start: (...callbackParams: RegeneratePayload[]) => void }) => {
	const [loading, setLoading] = useState(false);
	const { mutateAsync: createPastPaper } = trpc.paper.createPaper.useMutation();

	const generatePaper = useCallback(async () => {
		setLoading(true);
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
			start({
				id: created_paper.paper_id,
				num_questions: paper.num_questions,
				num_marks: paper.marks
			});
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
	const [regenerateData, setRegenerateData] = useState<RegeneratePayload | null>(null);
	const router = useRouter();
	const { isLoading, data: papers } = trpc.paper.getPapersByCode.useQuery(
		{ courseId: query.course_id, code: query.code },
		{ initialData: [], refetchInterval: 3000 }
	);
	const { mutateAsync: checkPaperGenerated } = trpc.paper.checkPaperGenerated.useMutation();
	const { mutate: regeneratePaper } = trpc.paper.regeneratePaper.useMutation();
	const { height } = useViewportSize();
	const { start, clear } = useTimeout(([data]: RegeneratePayload[]) => {
		checkPaperGenerated({id: data.id}).then(isGenerated => {
			if (!isGenerated) setRegenerateData(prev => data);
		});
	}, 50000);

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
											{paper.content || paper.status === 'success' ? (
												parse(paper.content, { trim: true })
											) : (
												<>
													<CustomLoader
														text='Generating Paper'
														subText={
															regenerateData
																? 'After 2 minutes if no paper is generated, click “here'
																: 'Approx waiting time is 20 to 60 seconds. Go grab a coffee while we get your paper ready'
														}
													>
														<div className='flex flex-col items-center'>
															{regenerateData && (
																<Button
																	size='md'
																	onClick={() => regeneratePaper(regenerateData)}
																>
																	Regenerate
																</Button>
															)}
														</div>
													</CustomLoader>
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
