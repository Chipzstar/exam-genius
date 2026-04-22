'use client';

import {
	Button,
	Collapse,
	Group,
	Rating,
	SegmentedControl,
	Space,
	Stack,
	Text,
	Textarea,
	Title
} from '@mantine/core';
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
		{ enabled: paper.status === 'success' }
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
	const [msOpen, setMsOpen] = useState(false);

	const showStructured =
		flags.structuredQuestions && Boolean(paper.structured_at) && rendererMode === 'structured';
	const attemptAnswers = useMemo(() => draftAnswers, [draftAnswers]);

	const mockSeconds = 90 * 60;

	return (
		<PaperErrorBoundary paperId={paper.paper_id}>
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
			<Space h='md' />
			{flags.structuredQuestions && paper.structured_at ? (
				<Group justify='center' mb='md'>
					<SegmentedControl
						value={rendererMode}
						onChange={v => appStore$.reader.rendererMode.set(v as 'structured' | 'classic')}
						data={[
							{ label: 'Structured', value: 'structured' },
							{ label: 'Classic', value: 'classic' }
						]}
					/>
				</Group>
			) : null}
			{flags.aiMarking ? (
				<Group justify='center' mb='md'>
					<SegmentedControl
						value={paperMode}
						onChange={v => setPaperMode(v as 'study' | 'mock' | 'review')}
						data={[
							{ label: 'Study', value: 'study' },
							{ label: 'Mock', value: 'mock' },
							{ label: 'Review', value: 'review' }
						]}
					/>
				</Group>
			) : null}
			{flags.aiMarking && paperMode === 'mock' ? (
				<Group justify='center' mb='md'>
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
			{paperMode === 'study' && markScheme?.status === 'success' ? (
				<Button variant='light' size='xs' mb='sm' onClick={() => setMsOpen(o => !o)}>
					{msOpen ? 'Hide' : 'Show'} mark scheme hints
				</Button>
			) : null}
			<Collapse in={msOpen && Boolean(markScheme?.model_answer)}>
				<Text size='sm' mb='md' component='pre' className='whitespace-pre-wrap max-h-48 overflow-auto'>
					{JSON.stringify(markScheme?.model_answer, null, 2)}
				</Text>
			</Collapse>
			<div className={clsx(classes.paperContentRoot, 'h-full px-6 py-2')} data-scale={String(fontScale)}>
				{showStructured && questions.length > 0 ? (
					<div className={clsx(classes.paperContent, 'paperContent')}>
						<QuestionTree
							questions={questions}
							mode={paperMode}
							attemptAnswers={attemptAnswers}
							onAnswerChange={onAnswerChange}
							flags={{ questionEdits: flags.questionEdits, aiMarking: flags.aiMarking }}
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
