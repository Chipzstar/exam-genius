'use client';

import { Alert, Button, Group, Rating, SegmentedControl, Stack, Text, Textarea, Title } from '@mantine/core';
import clsx from 'clsx';
import { LatexHtml } from './Latex';
import { useValue } from '@legendapp/state/react';
import { appStore$ } from '~/store/app.store';
import { api } from '~/trpc/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from '@mantine/hooks';
import { QuestionTree } from './QuestionTree';
import { MockTimer } from './MockTimer';
import { PaperErrorBoundary } from './PaperErrorBoundary';
import { MarkSchemeUnstructuredModal } from './MarkSchemeUnstructuredModal';
import { parseMarkSchemeModelAnswer } from './mark-scheme-hint.utils';
import { captureAttempt, captureRating } from '~/utils/posthog-events';
import type { RouterOutputs } from '~/trpc/react';

type PaperRow = RouterOutputs['paper']['getPapersByCode'][number];

type Props = {
	paper: PaperRow;
	mobileScreen: boolean;
	fontScale: number;
	initialMode?: string;
	classes: {
		paperContentRoot: string;
		paperContent: string;
		paperContentPrintFooter: string;
	};
};

export function PaperBody({ paper, mobileScreen, fontScale, initialMode, classes }: Props) {
	const flags = useValue(appStore$.flags);
	const rendererMode = useValue(appStore$.reader.rendererMode);
	const paperMode = useValue(appStore$.reader.paperMode);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const modeApplied = useRef(false);
	useEffect(() => {
		if (modeApplied.current || !initialMode) return;
		if (initialMode === 'study' || initialMode === 'mock' || initialMode === 'review') {
			appStore$.reader.paperMode.set(initialMode);
			modeApplied.current = true;
		}
	}, [initialMode]);

	const setPaperMode = useCallback(
		(v: 'study' | 'mock' | 'review') => {
			appStore$.reader.paperMode.set(v);
			const params = new URLSearchParams(searchParams.toString());
			params.set('mode', v);
			router.replace(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams]
	);

	const utils = api.useUtils();
	const { data: questions = [], refetch: refetchQuestions } = api.question.listForPaper.useQuery(
		{ paperId: paper.paper_id },
		{
			enabled:
				Boolean(paper.structured_at) && flags.structuredQuestions && rendererMode === 'structured'
		}
	);

	const ensureStructured = api.paper.ensureStructured.useMutation({
		onSuccess: () => {
			void utils.paper.getPapersByCode.invalidate();
			void refetchQuestions();
		}
	});

	const parseOnce = useRef(false);
	useEffect(() => {
		if (
			parseOnce.current ||
			!flags.structuredQuestions ||
			paper.structured_at ||
			paper.status !== 'success'
		) {
			return;
		}
		parseOnce.current = true;
		void ensureStructured.mutateAsync({ paperId: paper.paper_id });
	}, [flags.structuredQuestions, paper.structured_at, paper.paper_id, paper.status, ensureStructured]);

	const { data: markScheme } = api.paper.getMarkScheme.useQuery(
		{ paperId: paper.paper_id },
		{
			enabled: paper.status === 'success',
			refetchInterval: q => (q.state.data?.status === 'pending' ? 5000 : false)
		}
	);

	const { data: attempt, refetch: refetchAttempt } = api.attempt.getLatestForPaper.useQuery(
		{ paperId: paper.paper_id },
		{ enabled: flags.aiMarking }
	);

	const startAttempt = api.attempt.start.useMutation({
		onSuccess: () => {
			void refetchAttempt();
			captureAttempt('started', { paperId: paper.paper_id });
		}
	});
	const saveAnswer = api.attempt.saveAnswer.useMutation();
	const submitAttempt = api.attempt.submit.useMutation({
		onSuccess: () => {
			void refetchAttempt();
			captureAttempt('submitted', { paperId: paper.paper_id });
		}
	});

	const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!attempt?.answers) return;
		const next: Record<string, string> = {};
		for (const a of attempt.answers) next[a.question_id] = a.answer_text;
		setDraftAnswers(next);
	}, [attempt?.attempt_id, attempt?.answers]);

	const debouncedSave = useDebouncedCallback((attemptId: string, questionId: string, text: string) => {
		void saveAnswer.mutateAsync({ attemptId, questionId, text });
	}, 1500);

	const onAnswerChange = useCallback(
		(qid: string, text: string) => {
			setDraftAnswers(d => ({ ...d, [qid]: text }));
			if (attempt?.status === 'in_progress') {
				debouncedSave(attempt.attempt_id, qid, text);
			}
		},
		[attempt, debouncedSave]
	);

	const { mutateAsync: submitRating, isPending: isSubmittingRating } = api.rating.submitPaper.useMutation({
		onSuccess: () => {
			captureRating('paper', { paperId: paper.paper_id });
			void utils.paper.getPapersByCode.invalidate({
				courseId: paper.course_id,
				code: paper.paper_code
			});
		}
	});

	const [ratingVal, setRatingVal] = useState<number>(paper.paperRating?.stars ?? 0);
	const [ratingNote, setRatingNote] = useState('');
	const [ratingSaved, setRatingSaved] = useState(false);

	useEffect(() => {
		const pr = paper.paperRating;
		setRatingVal(pr?.stars ?? 0);
		setRatingNote(pr?.comment ?? '');
		setRatingSaved(Boolean(pr));
	}, [paper.paper_id, paper.paperRating?.stars, paper.paperRating?.comment]);
	const [markSchemeModalOpen, setMarkSchemeModalOpen] = useState(false);

	const showStructured =
		flags.structuredQuestions && Boolean(paper.structured_at) && rendererMode === 'structured';
	const attemptAnswers = useMemo(() => draftAnswers, [draftAnswers]);

	const markSchemeParsed = useMemo(
		() => parseMarkSchemeModelAnswer(markScheme?.model_answer),
		[markScheme?.model_answer]
	);

	const markSchemeByQuestionId =
		paperMode === 'study' && markScheme?.status === 'success' && markSchemeParsed.byId.size > 0
			? markSchemeParsed.byId
			: undefined;

	const showClassicMarkScheme =
		paperMode === 'study' &&
		markScheme?.status === 'success' &&
		markSchemeParsed.order.length > 0 &&
		!(showStructured && questions.length > 0);

	const mockSeconds = 90 * 60;

	const showRendererToggle = flags.structuredQuestions && Boolean(paper.structured_at);
	const showPaperModeToggle = flags.aiMarking;

	return (
		<PaperErrorBoundary paperId={paper.paper_id}>
			<Stack gap={4} align='center' mb='sm' px='xs'>
				<Group justify='center' gap='xs' wrap='wrap' align='center'>
					<Title order={3} size='h4' c='brand' lh={1.2} m={0}>
						ExamGenius
					</Title>
					{paper.name ? (
						<Text
							component='span'
							size={mobileScreen ? 'lg' : 'xl'}
							fw={600}
							lh={1.2}
						>
							{paper.name}
						</Text>
					) : null}
				</Group>
				<Text size='xs' c='dimmed' lh={1.2}>
					AI Predicted Paper
				</Text>
				{showRendererToggle || showPaperModeToggle ? (
					<Group justify='center' gap='sm' wrap='wrap' mt={4}>
						{showRendererToggle ? (
							<SegmentedControl
								size='sm'
								value={rendererMode}
								onChange={v => appStore$.reader.rendererMode.set(v as 'structured' | 'classic')}
								data={[
									{ label: 'Structured', value: 'structured' },
									{ label: 'Classic', value: 'classic' }
								]}
							/>
						) : null}
						{showPaperModeToggle ? (
							<SegmentedControl
								size='sm'
								value={paperMode}
								onChange={v => setPaperMode(v as 'study' | 'mock' | 'review')}
								data={[
									{ label: 'Study', value: 'study' },
									{ label: 'Mock', value: 'mock' },
									{ label: 'Review', value: 'review' }
								]}
							/>
						) : null}
					</Group>
				) : null}
			</Stack>
			{flags.aiMarking && paperMode === 'mock' ? (
				<Group justify='center' mb='xs' wrap='wrap'>
					<MockTimer initialSeconds={mockSeconds} />
					{!attempt || attempt.status !== 'in_progress' ? (
						<Button
							size='sm'
							onClick={() =>
								void startAttempt.mutateAsync({ paperId: paper.paper_id, mode: 'mock', timeLimitSec: mockSeconds })
							}
						>
							Start mock
						</Button>
					) : (
						<Button
							size='sm'
							onClick={() => void submitAttempt.mutateAsync({ attemptId: attempt.attempt_id })}
							loading={submitAttempt.isPending}
						>
							Submit for marking
						</Button>
					)}
				</Group>
			) : null}
			{showClassicMarkScheme ? (
				<Group justify='center' mb='xs'>
					<Button variant='light' size='xs' onClick={() => setMarkSchemeModalOpen(true)}>
						Mark scheme hints
					</Button>
				</Group>
			) : null}
			{paperMode === 'study' && markScheme?.status === 'pending' ? (
				<Alert
					variant='light'
					color='blue'
					mb='xs'
					py='xs'
					px='sm'
					ta='center'
					styles={{ message: { fontSize: 'var(--mantine-font-size-xs)' } }}
				>
					Mark scheme hints are being generated and will appear automatically in a moment.
				</Alert>
			) : null}
			<MarkSchemeUnstructuredModal
				opened={markSchemeModalOpen}
				onClose={() => setMarkSchemeModalOpen(false)}
				order={markSchemeParsed.order}
				byId={markSchemeParsed.byId}
			/>
			<div className={clsx(classes.paperContentRoot, 'h-full px-6 pt-1 pb-2')} data-scale={String(fontScale)}>
				{showStructured && questions.length > 0 ? (
					<div className={clsx(classes.paperContent, 'paperContent')}>
						<QuestionTree
							questions={questions}
							mode={paperMode}
							attemptAnswers={attemptAnswers}
							onAnswerChange={onAnswerChange}
							flags={{ questionEdits: flags.questionEdits, aiMarking: flags.aiMarking }}
							markSchemeByQuestionId={markSchemeByQuestionId}
						/>
					</div>
				) : (
					<>
						<div className={clsx(classes.paperContent, 'paperContent')}>
							<LatexHtml html={paper.content} />
						</div>
						<div className={classes.paperContentPrintFooter} data-paper-print-footer>
							ExamGenius: AI-predicted practice content — not an official past paper.
						</div>
					</>
				)}
			</div>
			<Stack pt='lg' gap='sm'>
				<Text size='sm' fw={600}>
					Rate this paper
				</Text>
				<Rating value={ratingVal} onChange={setRatingVal} />
				<Textarea
					placeholder='Optional feedback'
					value={ratingNote}
					onChange={e => setRatingNote(e.currentTarget.value)}
					minRows={2}
				/>
				<Button
					size='sm'
					disabled={ratingVal < 1 || isSubmittingRating}
					loading={isSubmittingRating}
					onClick={async () => {
						await submitRating({
							paperId: paper.paper_id,
							stars: ratingVal,
							comment: ratingNote || undefined
						});
						setRatingSaved(true);
					}}
				>
					{ratingVal >= 1 && ratingSaved && paper.paperRating?.stars === ratingVal
						? 'Saved'
						: 'Save rating'}
				</Button>
			</Stack>
		</PaperErrorBoundary>
	);
}
