'use client';

import {
	Anchor,
	Button,
	Card,
	Loader,
	LoadingOverlay,
	ScrollArea,
	Space,
	Stack,
	Text,
	Title
} from '@mantine/core';
import Page from '~/layout/Page';
import React, { useCallback, useState } from 'react';
import { useMediaQuery, useTimeout, useViewportSize } from '@mantine/hooks';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react';
import parse from 'html-react-parser';
import { Carousel } from '@mantine/carousel';
import CustomLoader from '~/components/CustomLoader';
import { PATHS, TWO_MINUTES } from '~/utils/constants';
import { ExamBoard, Subject, SUBJECT_PAPERS } from '@exam-genius/shared/utils';
import { capitalize, notifyError, notifySuccess, sanitize } from '~/utils/functions';
import axios from 'axios';
import Link from 'next/link';
import { GeneratePaperPayload } from '~/utils/types';
import classes from './Paper.module.css';

interface RegeneratePayload {
	id: string;
	num_questions: number;
	num_marks: number;
}

const NoPapers = ({ query, start }: { query: { course_id: string; unit: string; code: string; subject: Subject; board: ExamBoard }; start: (...callbackParams: RegeneratePayload[]) => void }) => {
	const [loading, setLoading] = useState(false);
	const { mutateAsync: createPastPaper } = api.paper.createPaper.useMutation();

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
			axios
				.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/server/paper/generate`, {
					paper_id: created_paper.paper_id,
					paper_name: created_paper.name,
					course: capitalize(sanitize(created_paper.unit_name)),
					subject: capitalize(created_paper.subject),
					exam_board: capitalize(created_paper.exam_board),
					num_questions: paper.num_questions,
					num_marks: paper.marks
				} as GeneratePaperPayload)
				.then(({ data }) => {
					notifySuccess(
						'paper-generation-success',
						`${capitalize(created_paper.exam_board)} ${capitalize(created_paper.subject)} paper has now been generated!!`,
						<IconCheck size={20} />
					);
				})
				.catch(error => {
					console.error(error);
				});
			start({
				id: created_paper.paper_id,
				num_questions: paper.num_questions,
				num_marks: paper.marks
			});
		} catch (err: any) {
			console.error(err);
			notifyError('generate-paper-failed', err.message, <IconX size={20} />);
		} finally {
			setLoading(false);
		}
	}, [query, start, createPastPaper]);

	return (
		<div className='flex h-full flex-col items-center justify-center space-y-12'>
			<Stack align='center'>
				<Title order={1}>You have no papers for this course</Title>
				<Text c='dimmed' size='sm'>
					Click below to generate a new paper
				</Text>
			</Stack>
			<Button size='xl' onClick={() => generatePaper()} loading={loading}>
				Generate Paper
			</Button>
		</div>
	);
};

export default function PaperPage({ params }: { params: { course_id: string; unit: string; paper: string } }) {
	const [regenerateData, setRegenerateData] = useState<RegeneratePayload | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get('code') ?? '';
	const subject = (searchParams.get('subject') ?? '') as Subject;
	const board = (searchParams.get('board') ?? '') as ExamBoard;
	const utils = api.useUtils();
	const { isLoading, data: papers } = api.paper.getPapersByCode.useQuery(
		{ courseId: params.course_id, code: code },
		{ initialData: [], refetchInterval: 3000 }
	);
	const { mutateAsync: checkPaperGenerated } = api.paper.checkPaperGenerated.useMutation();
	const { mutate: regeneratePaper, isPending: regenLoading } = api.paper.regeneratePaper.useMutation();
	const { mutateAsync: deletePaper } = api.paper.deletePaper.useMutation({
		onSuccess() {
			utils.paper.getPapersByCode.invalidate({ courseId: params.course_id, code: code });
		}
	});
	const { height } = useViewportSize();
	const { start } = useTimeout(([data]: RegeneratePayload[]) => {
		checkPaperGenerated({ id: data.id }).then(isGenerated => {
			if (!isGenerated) setRegenerateData(data);
		});
	}, TWO_MINUTES);
	const mobileScreen = useMediaQuery('(max-width: 30em)');

	return (
		<Page.Container extraClassNames='overflow-y-hidden'>
			<header className='flex items-center justify-between p-6'>
				<Button
					leftSection={<IconArrowLeft />}
					size={mobileScreen ? 'sm' : 'md'}
					variant='outline'
					onClick={() =>
						router.replace(
							`${PATHS.COURSE}/${params.course_id}/${params.unit}?subject=${subject}&board=${board}`
						)
					}
				>
					Back
				</Button>
				<div className='flex flex-wrap items-center space-x-6'>
					<Text>
						Need Help? Visit our{' '}
						<Link href={PATHS.FAQ}>
							<span className='text-primary '>FAQ page</span>
						</Link>{' '}
						or contact us at{' '}
						<Anchor
							className='font-bold'
							href='mailto:support@exam-genius.com'
							target='_blank'
							rel='noreferrer'
						>
							support@exam-genius.com
						</Anchor>
					</Text>
				</div>
			</header>
			<Page.Body extraClassNames='px-2 sm:px-6 sm:justify-center w-full '>
				{isLoading ? (
					<LoadingOverlay visible={isLoading} />
				) : !papers.length ? (
					<NoPapers query={{ course_id: params.course_id, unit: params.unit, code, subject, board }} start={start} />
				) : (
					<Carousel mx='auto' classNames={classes} controlsOffset='xl'>
						{papers.map((paper, index) => (
							<Carousel.Slide key={index}>
								<ScrollArea.Autosize
									mah={mobileScreen ? height - 150 : height - 100}
									p='sm'
								>
									<Card shadow='sm' radius='md' className='w-full' p='xl'>
										{!(process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') && (
											<Button
												color='red'
												variant='outline'
												className={classes.deleteButton}
												onClick={() => deletePaper({ id: paper.paper_id })}
											>
												Delete
											</Button>
										)}
										<div className='flex justify-center'>
											<Stack justify='center' align='center'>
												<Title c='brand'>ExamGenius</Title>
												{paper.name && (
													<Text size={mobileScreen ? 'xl' : '30px'} fw={600}>
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
											) : paper.status === 'failed' ? (
												<div className='flex flex-col items-center space-y-4'>
													<Text ta='center' size='sm' w={300}>
														Our AI failed to generate this paper. Click the button below to
														create a new one.
													</Text>
													<Button
														size='md'
														onClick={() => {
															const paper_info = SUBJECT_PAPERS[paper.subject][
																paper.exam_board
															][paper.unit_name].papers.find(
																p => p.code === paper.paper_code
															);
															if (!paper_info)
																notifyError(
																	'invalid-paper-code',
																	`No paper found with paper code ${paper.paper_code}. Refresh the page and try again.`,
																	<IconX size={20} />
																);
															else {
																regeneratePaper({
																	id: paper.paper_id,
																	num_questions: paper_info.num_questions,
																	num_marks: paper_info.marks
																});
																start({
																	id: paper.paper_id,
																	num_questions: paper_info.num_questions,
																	num_marks: paper_info.marks
																});
															}
														}}
														loading={regenLoading}
													>
														Regenerate
													</Button>
												</div>
											) : (
												<CustomLoader
													text='Generating Paper'
													subText={
														regenerateData
															? 'After 2 minutes if no paper is generated, click here'
															: 'Approx waiting time is 30 seconds to 2 minutes. Go grab a coffee while we get your paper ready'
													}
												>
													<div className='flex flex-col items-center'>
														{regenerateData && (
															<Button
																size='md'
																onClick={() => regeneratePaper(regenerateData)}
																loading={regenLoading}
															>
																Regenerate
															</Button>
														)}
													</div>
												</CustomLoader>
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
}

