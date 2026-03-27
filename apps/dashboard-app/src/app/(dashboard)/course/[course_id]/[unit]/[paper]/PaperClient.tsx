'use client';

import {
	Anchor,
	Button,
	Card,
	LoadingOverlay,
	ScrollArea,
	Space,
	Stack,
	Text,
	Title
} from '@mantine/core';
import Page from '~/layout/Page';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery, useTimeout, useViewportSize } from '@mantine/hooks';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Carousel } from '@mantine/carousel';
import CustomLoader from '~/components/CustomLoader';
import { PATHS, TWO_MINUTES } from '~/utils/constants';
import { ExamBoard, Subject, SUBJECT_PAPERS } from '@exam-genius/shared/utils';
import { capitalize, notifyError, notifySuccess, sanitize } from '~/utils/functions';
import Link from 'next/link';
import { GeneratePaperPayload } from '~/utils/types';
import classes from './Paper.module.css';
import type { RouterOutputs } from '~/trpc/react';
import clsx from 'clsx';
import { useValue } from '@legendapp/state/react';
import { appStore$, recordPaperOpen } from '~/store/app.store';
import { DisclaimerStrip } from '~/components/DisclaimerStrip';
import { ReaderToolbar } from '~/components/ReaderToolbar';

/** Safe subset for AI-generated exam HTML (lists, emphasis, tables); strips scripts and event handlers. */
const PAPER_HTML_SANITIZE: DOMPurify.Config = {
	USE_PROFILES: { html: true }
};

interface RegeneratePayload {
	id: string;
	num_questions: number;
	num_marks: number;
}

interface PaperClientProps {
	params: {
		course_id: string;
		unit: string;
		paper: string;
	};
	searchParams: {
		code: string;
		subject: Subject;
		board: ExamBoard;
	};
	initialPapers: RouterOutputs['paper']['getPapersByCode'];
}

const NoPapers = ({
	query,
	start
}: {
	query: { course_id: string; unit: string; code: string; subject: Subject; board: ExamBoard };
	start: (...callbackParams: RegeneratePayload[]) => void;
}) => {
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
			fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/server/paper/generate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					paper_id: created_paper.paper_id,
					paper_name: created_paper.name,
					course: capitalize(sanitize(created_paper.unit_name)),
					subject: capitalize(created_paper.subject),
					exam_board: capitalize(created_paper.exam_board),
					num_questions: paper.num_questions,
					num_marks: paper.marks
				} as GeneratePaperPayload)
			})
				.then(response => response.json())
				.then(() => {
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

export default function PaperClient({ params, searchParams, initialPapers }: PaperClientProps) {
	const [regenerateData, setRegenerateData] = useState<RegeneratePayload | null>(null);
	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const lastRecordedRef = useRef('');
	const router = useRouter();
	const { code, subject, board } = searchParams;
	const fontScale = useValue(appStore$.reader.fontScale);
	const focusMode = useValue(appStore$.reader.focusMode);

	const utils = api.useUtils();
	const { isLoading, data: papers } = api.paper.getPapersByCode.useQuery(
		{ courseId: params.course_id, code: code },
		{ initialData: initialPapers, refetchInterval: 3000 }
	);
	const { mutateAsync: checkPaperGenerated } = api.paper.checkPaperGenerated.useMutation();
	const { mutate: regeneratePaper, isPending: regenLoading } = api.paper.regeneratePaper.useMutation();
	const { mutate: deletePaper, isPending: deletePaperPending } = api.paper.deletePaper.useMutation({
		onSuccess(_, variables) {
			const lastOpened = appStore$.lastOpenedPaper.get();
			if (lastOpened?.paperId === variables.id) {
				appStore$.lastOpenedPaper.set(null);
			}

			const recent = appStore$.recentPapers.get() ?? [];
			appStore$.recentPapers.set(recent.filter(p => p.paperId !== variables.id));

			utils.paper.getPapersByCode.invalidate({ courseId: params.course_id, code });
		}
	});
	const showDevDelete = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';
	const { height } = useViewportSize();
	const { start } = useTimeout(([data]: RegeneratePayload[]) => {
		checkPaperGenerated({ id: data.id }).then(isGenerated => {
			if (!isGenerated) setRegenerateData(data);
		});
	}, TWO_MINUTES);
	const mobileScreen = useMediaQuery('(max-width: 30em)');

	useEffect(() => {
		if (focusMode) {
			document.body.classList.add('paper-focus-mode');
			return () => document.body.classList.remove('paper-focus-mode');
		}
		document.body.classList.remove('paper-focus-mode');
		return undefined;
	}, [focusMode]);

	useEffect(() => {
		if (!papers?.length) return;
		const idx = Math.min(activeSlideIndex, papers.length - 1);
		const paper = papers[idx];
		if (!paper || paper.status !== 'success' || !paper.content?.trim()) return;

		const dedupeKey = `${idx}:${paper.paper_id}:${String(paper.content).length}`;
		if (lastRecordedRef.current === dedupeKey) return;
		lastRecordedRef.current = dedupeKey;

		const resumeUrl = `${PATHS.COURSE}/${params.course_id}/${params.unit}/${params.paper}?subject=${encodeURIComponent(subject)}&board=${encodeURIComponent(board)}&code=${encodeURIComponent(code)}`;

		recordPaperOpen({
			paperId: paper.paper_id,
			courseId: params.course_id,
			unit: params.unit,
			href: params.paper,
			code,
			subject,
			board,
			name: paper.name ?? 'Paper',
			resumeUrl
		});
	}, [papers, activeSlideIndex, params.course_id, params.unit, params.paper, subject, board, code]);

	useEffect(() => {
		if (papers?.length && activeSlideIndex > papers.length - 1) {
			setActiveSlideIndex(Math.max(0, papers.length - 1));
		}
	}, [papers, activeSlideIndex]);

	return (
		<Page.Container
			extraClassNames={clsx(
				'overflow-y-hidden',
				classes.paperViewRoot,
				focusMode && classes.paperFocusRoot
			)}
		>
			<header className='paper-no-print flex items-center justify-between p-6'>
				<Button
					leftSection={<IconArrowLeft />}
					size={mobileScreen ? 'sm' : 'md'}
					variant='outline'
					onClick={() =>
						router.replace(`${PATHS.COURSE}/${params.course_id}/${params.unit}?subject=${subject}&board=${board}`)
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
						<Anchor className='font-bold' href='mailto:support@exam-genius.com' target='_blank' rel='noreferrer'>
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
					<>
						<DisclaimerStrip />
						<Carousel
							mx='auto'
							classNames={classes}
							controlsOffset='xl'
							onSlideChange={setActiveSlideIndex}
						>
						{papers.map((paper, slideIndex) => {
							const hasPdfExport =
								paper.status === 'success' && Boolean(paper.content && paper.content.trim().length > 0);
							const pdfSourceId = hasPdfExport ? `paper-pdf-export-${paper.paper_id}` : null;
							const safePdfBase =
								(paper.name ?? 'exam-paper')
									.replace(/[/\\?%*:|"<>]/g, '')
									.trim()
									.slice(0, 80) || 'exam-paper';

							return (
								<Carousel.Slide key={paper.paper_id}>
									<ReaderToolbar
										pdfSourceId={pdfSourceId}
										pdfFilename={`ExamGenius-${safePdfBase}.pdf`}
										slideIndex={slideIndex}
										activeSlideIndex={activeSlideIndex}
										showDevDelete={showDevDelete}
										onDelete={() => deletePaper({ id: paper.paper_id })}
										deleteLoading={deletePaperPending}
										paperTitle={paper.name}
										paperId={paper.paper_id}
									/>
									<ScrollArea.Autosize mah={mobileScreen ? height - 150 : height - 100} p='sm'>
										<Card shadow='sm' radius='md' className={clsx('w-full', classes.paperCard)} p='xl'>
											{paper.content && paper.status === 'success' ? (
												<div id={pdfSourceId ?? undefined}>
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
													<div
														className={clsx(classes.paperContentRoot, 'h-full px-6 py-2')}
														data-scale={String(fontScale)}
													>
														{paper.content ? (
															<>
																<div className={clsx(classes.paperContent, 'paperContent')}>
																	{parse(DOMPurify.sanitize(paper.content, PAPER_HTML_SANITIZE), {
																		trim: true
																	})}
																</div>
																<div
																	className={classes.paperContentPrintFooter}
																	data-paper-print-footer
																>
																	ExamGenius: AI-predicted practice content — not an
																	official past paper.
																</div>
															</>
														) : (
															<Text c='dimmed' size='sm'>
																Content is still loading…
															</Text>
														)}
													</div>
												</div>
											) : paper.status === 'failed' ? (
												<>
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
													<div
														className={clsx(classes.paperContentRoot, 'h-full px-6 py-2')}
														data-scale={String(fontScale)}
													>
														<div className='flex flex-col items-center space-y-4'>
															<Text ta='center' size='sm' w={300}>
																Our AI failed to generate this paper. Click the button below to create a
																new one.
															</Text>
															<Button
																size='md'
																onClick={() => {
																	const paper_info = SUBJECT_PAPERS[paper.subject][paper.exam_board][
																		paper.unit_name
																	].papers.find(p => p.code === paper.paper_code);
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
													</div>
												</>
											) : (
												<>
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
													<div
														className={clsx(classes.paperContentRoot, 'h-full px-6 py-2')}
														data-scale={String(fontScale)}
													>
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
													</div>
												</>
											)}
										</Card>
									</ScrollArea.Autosize>
								</Carousel.Slide>
							);
						})}
						</Carousel>
					</>
				)}
			</Page.Body>
		</Page.Container>
	);
}
