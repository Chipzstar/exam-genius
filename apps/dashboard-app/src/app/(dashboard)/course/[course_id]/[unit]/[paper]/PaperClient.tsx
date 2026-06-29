'use client';

import {
	Alert,
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
import { modals } from '@mantine/modals';
import Page from '~/layout/Page';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery, useTimeout, useViewportSize } from '@mantine/hooks';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { Carousel, type Embla } from '@mantine/carousel';
import CustomLoader from '~/components/CustomLoader';
import { PATHS, TWO_MINUTES } from '~/utils/constants';
import { ExamBoard, Subject, getSubjectPapersCatalog, type ExamLevel } from '@exam-genius/shared/utils';
import { capitalize, notifyError, notifySuccess, sanitize } from '~/utils/functions';
import Link from 'next/link';
import classes from './Paper.module.css';
import type { RouterOutputs } from '~/trpc/react';
import clsx from 'clsx';
import { useValue } from '@legendapp/state/react';
import { appStore$, recordPaperOpen } from '~/store/app.store';
import { DisclaimerStrip } from '~/components/DisclaimerStrip';
import { ReaderToolbar } from '~/components/ReaderToolbar';
import { PaperBody } from '~/components/paper/PaperBody';
import { SubjectIcon } from '~/components/subject-icon';

interface RegeneratePayload {
	id: string;
	num_questions: number;
	num_marks: number;
}

function findPaperInCatalog(params: {
	examLevel: ExamLevel;
	subject: Subject;
	board: ExamBoard;
	unit: string;
	code: string;
}) {
	const cat = getSubjectPapersCatalog(params.examLevel);
	return cat[params.subject]?.[params.board]?.[params.unit]?.papers.find(p => p.code === params.code) ?? null;
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
		mode?: string;
	};
	initialPapers: RouterOutputs['paper']['getPapersByCode'];
	courseExamLevel: ExamLevel;
}

const NoPapers = ({
	query,
	start
}: {
	query: {
		course_id: string;
		unit: string;
		code: string;
		subject: Subject;
		board: ExamBoard;
		examLevel: ExamLevel;
	};
	start: (...callbackParams: RegeneratePayload[]) => void;
}) => {
	const [loading, setLoading] = useState(false);
	const { mutateAsync: createPastPaper } = api.paper.createPaper.useMutation();
	const { mutateAsync: triggerBackendGenerate } = api.paper.triggerBackendGenerate.useMutation();

	const generatePaper = useCallback(async () => {
		setLoading(true);
		const paper = findPaperInCatalog({
			examLevel: query.examLevel,
			subject: query.subject,
			board: query.board,
			unit: query.unit,
			code: query.code
		});
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
			await triggerBackendGenerate({
				paperId: created_paper.paper_id,
				num_questions: paper.num_questions,
				num_marks: paper.marks
			});
			notifySuccess(
				'paper-generation-success',
				`${capitalize(created_paper.exam_board)} ${capitalize(created_paper.subject)} paper has now been generated!!`,
				<IconCheck size={20} />
			);
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
	}, [query, start, createPastPaper, triggerBackendGenerate]);

	return (
		<div className='flex h-full items-center justify-center px-4 py-10'>
			<Card className='relative w-full max-w-2xl overflow-hidden rounded-[2rem] border-0 bg-white/90 p-8 text-center shadow-2xl shadow-slate-950/10 backdrop-blur dark:border dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/30'>
				<div className='absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-2xl dark:bg-primary/25' />
				<div className='absolute -bottom-20 left-[-2rem] h-44 w-44 rounded-full bg-[#BEFF2D]/25 blur-2xl dark:bg-[#BEFF2D]/10' />
				<Stack align='center' className='relative'>
					<SubjectIcon
						subject={query.subject}
						wrapperClassName='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] bg-primary/10 p-3 shadow-xl shadow-primary/20 dark:bg-white/10'
						imageSize={64}
						imageClassName='h-16 w-16 object-contain'
						fallbackClassName='flex h-full w-full items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white'
					/>
					<Text className='text-xs font-bold uppercase tracking-[0.2em] text-primary'>Ready to generate</Text>
					<Title className='max-w-xl text-3xl font-bold tracking-[-0.05em] text-slate-950 dark:text-white'>
						No generated papers yet.
					</Title>
					<Text className='max-w-md text-sm font-medium leading-6 text-slate-500 dark:text-slate-400'>
						Create your first AI predicted paper for this unit, then return here to view each generated variant.
					</Text>
				</Stack>
				<Button
					size='lg'
					onClick={() => generatePaper()}
					loading={loading}
					className='relative mt-8 rounded-full bg-[#BEFF2D] px-8 text-sm font-bold text-slate-950 shadow-lg shadow-[#BEFF2D]/20 hover:bg-[#d7ff70]'
				>
				Generate Paper
			</Button>
			</Card>
		</div>
	);
};

export default function PaperClient({ params, searchParams, initialPapers, courseExamLevel }: PaperClientProps) {
	const [regenerateData, setRegenerateData] = useState<RegeneratePayload | null>(null);
	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const emblaRef = useRef<Embla | null>(null);
	const lastRecordedRef = useRef('');
	const router = useRouter();
	const { code, subject, board, mode: modeFromUrl } = searchParams;
	const fontScale = useValue(appStore$.reader.fontScale);
	const focusMode = useValue(appStore$.reader.focusMode);

	const utils = api.useUtils();
	const { isLoading, data: papers } = api.paper.getPapersByCode.useQuery(
		{ courseId: params.course_id, code: code },
		{ initialData: initialPapers, refetchInterval: 3000 }
	);
	const { mutateAsync: checkPaperGenerated } = api.paper.checkPaperGenerated.useMutation();
	const { mutate: regeneratePaper, isPending: regenLoading } = api.paper.regeneratePaper.useMutation();
	const { mutateAsync: regenerateWithLegacyGrantAsync, isPending: legacyGrantLoading } =
		api.paper.regenerateWithLegacyGrant.useMutation();
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

	const goToPaperVariantPage = useCallback((page: number) => {
		emblaRef.current?.scrollTo(page - 1);
	}, []);

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
			resumeUrl,
			examLevel: courseExamLevel
		});
	}, [papers, activeSlideIndex, params.course_id, params.unit, params.paper, subject, board, code, courseExamLevel]);

	useEffect(() => {
		if (papers?.length && activeSlideIndex > papers.length - 1) {
			setActiveSlideIndex(Math.max(0, papers.length - 1));
		}
	}, [papers, activeSlideIndex]);

	return (
		<Page.Container
			classNames='min-h-screen bg-[#F7F8FF] text-slate-950 dark:bg-[#080B18] dark:text-slate-100'
			extraClassNames={clsx(
				'relative overflow-hidden',
				classes.paperViewRoot,
				focusMode && classes.paperFocusRoot
			)}
		>
			<div className='pointer-events-none absolute right-[-140px] top-[-180px] h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-3xl dark:bg-primary/25' />
			<div className='pointer-events-none absolute bottom-[-180px] left-[-120px] h-96 w-96 rounded-full bg-[#BEFF2D]/20 blur-3xl dark:bg-[#BEFF2D]/10' />
			<header className='paper-no-print relative z-10 mx-auto w-full max-w-7xl px-4 py-4 sm:px-6'>
				<div className='flex flex-col gap-4 rounded-[1.5rem] bg-[#030A39] p-4 text-white shadow-2xl shadow-slate-950/15 dark:border dark:border-white/10 dark:bg-[#020617] dark:shadow-black/40 sm:flex-row sm:items-center sm:justify-between sm:p-5'>
					<div className='flex items-center gap-3'>
						<SubjectIcon
							subject={subject}
							wrapperClassName='hidden h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-2 sm:flex'
							imageSize={40}
							imageClassName='h-10 w-10 object-contain'
							fallbackClassName='flex h-full w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white'
						/>
						<Button
							leftSection={<IconArrowLeft />}
							size={mobileScreen ? 'sm' : 'md'}
							variant='subtle'
							onClick={() =>
								router.replace(`${PATHS.COURSE}/${params.course_id}/${params.unit}?subject=${subject}&board=${board}`)
							}
							className='rounded-full bg-white/10 px-6 text-white hover:bg-white/15'
						>
							Back
						</Button>
					</div>
					<div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-300'>
						<Text className='text-sm font-medium text-slate-300'>
							Need Help? Visit our{' '}
							<Link href={PATHS.FAQ}>
								<span className='font-semibold text-[#BEFF2D]'>FAQ page</span>
							</Link>{' '}
							or contact us via{' '}
							<span
								role='button'
								className='cursor-pointer font-semibold text-[#BEFF2D]'
								onClick={() => window.Tawk_API?.toggle?.()}
							>
								Live Chat
							</span>
						</Text>
					</div>
				</div>
			</header>
			<Page.Body classNames='relative z-10 flex grow flex-col px-2 sm:px-6 sm:justify-center w-full'>
				{isLoading ? (
					<LoadingOverlay visible={isLoading} />
				) : !papers.length ? (
					<NoPapers
						query={{
							course_id: params.course_id,
							unit: params.unit,
							code,
							subject,
							board,
							examLevel: courseExamLevel
						}}
						start={start}
					/>
				) : (
					<>
						<DisclaimerStrip />
						<Carousel
							mx='auto'
							classNames={classes}
							controlsOffset='xl'
							align='start'
							containScroll='trimSnaps'
							withControls={false}
							withIndicators={false}
							onSlideChange={setActiveSlideIndex}
							getEmblaApi={emblaApi => {
								emblaRef.current = emblaApi;
							}}
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
										paperVariantTotal={papers.length}
										onPaperVariantPageChange={papers.length > 1 ? goToPaperVariantPage : undefined}
									/>
									<ScrollArea.Autosize
										mah={height - 150}
										p='sm'
										viewportProps={{ style: { touchAction: 'pan-y' } }}
									>
										<Card
											className={clsx(
												'w-full rounded-[1.75rem] border-0 shadow-2xl shadow-slate-950/10 dark:border dark:border-white/10 dark:shadow-black/30',
												classes.paperCard
											)}
											p='xl'
										>
											{paper.content && paper.status === 'success' ? (
												<>
													{paper.legacy_one_time_regenerate_available ? (
														<Alert color='brand' variant='light' mb='md' title='Latest features'>
															<Text size='sm'>
																Regenerate this paper once with the latest AI pipeline. Any mock attempts
																and your star rating for this paper will be removed.
															</Text>
															<Button
																mt='sm'
																size='sm'
																variant='light'
																loading={legacyGrantLoading}
																onClick={() => {
																	const paper_info = findPaperInCatalog({
																		examLevel: courseExamLevel,
																		subject: paper.subject as Subject,
																		board: paper.exam_board as ExamBoard,
																		unit: paper.unit_name,
																		code: paper.paper_code
																	});
																	if (!paper_info) {
																		notifyError(
																			'invalid-paper-code',
																			`No paper found with paper code ${paper.paper_code}. Refresh the page and try again.`,
																			<IconX size={20} />
																		);
																		return;
																	}
																	modals.openConfirmModal({
																		title: 'Use your one-time regeneration?',
																		children: (
																			<Text size='sm'>
																				This cannot be undone. You will receive a newly generated paper and
																				lose attempts and ratings tied to this copy.
																			</Text>
																		),
																		labels: { confirm: 'Regenerate', cancel: 'Cancel' },
																		confirmProps: { color: 'brand' },
																		onConfirm: async () => {
																			try {
																				await regenerateWithLegacyGrantAsync({
																					id: paper.paper_id,
																					num_questions: paper_info.num_questions,
																					num_marks: paper_info.marks
																				});
																				start({
																					id: paper.paper_id,
																					num_questions: paper_info.num_questions,
																					num_marks: paper_info.marks
																				});
																			} catch (err: unknown) {
																				const msg =
																					err instanceof Error ? err.message : String(err);
																				notifyError(
																					'legacy-regenerate-failed',
																					msg || 'Could not start regeneration.',
																					<IconX size={20} />
																				);
																			}
																		}
																	});
																}}
															>
																Regenerate (one-time)
															</Button>
														</Alert>
													) : null}
												<div id={pdfSourceId ?? undefined}>
													<PaperBody
														paper={paper}
														mobileScreen={Boolean(mobileScreen)}
														fontScale={fontScale}
														initialMode={modeFromUrl}
														classes={{
															paperContentRoot: classes.paperContentRoot,
															paperContent: classes.paperContent,
															paperContentPrintFooter: classes.paperContentPrintFooter
														}}
														courseExamLevel={courseExamLevel}
													/>
												</div>
												</>
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
																	const paper_info = findPaperInCatalog({
																		examLevel: courseExamLevel,
																		subject: paper.subject as Subject,
																		board: paper.exam_board as ExamBoard,
																		unit: paper.unit_name,
																		code: paper.paper_code
																	});
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
