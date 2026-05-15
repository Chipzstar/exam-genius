'use client';

import {
	ActionIcon,
	Box,
	Group,
	Menu,
	Stack,
	Textarea,
	Text,
	Badge,
	Drawer,
	Modal,
	Button,
	Chip,
	TextInput,
	Checkbox,
	Skeleton
} from '@mantine/core';
import {
	IconCheck,
	IconDotsVertical,
	IconRefresh,
	IconThumbDown,
	IconThumbUp,
	IconX
} from '@tabler/icons-react';
import DOMPurify from 'dompurify';
import { LatexHtml, LatexText } from './Latex';
import type { RouterOutputs } from '~/trpc/react';
import { api } from '~/trpc/react';
import { useCallback, useMemo, useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { notifyError, notifySuccess } from '~/utils/functions';
import { captureQuestionEdit, captureRating } from '~/utils/posthog-events';
import { MarkSchemeHintButton } from './MarkSchemeHintButton';
import type { MarkSchemeItem } from './mark-scheme-hint.utils';

type Q = RouterOutputs['question']['listForPaper'][number];

type QuestionFeedbackSentiment = 1 | -1;

function wrapBlockMath(value: string): string {
	const v = value.trim();
	if (!v) return '';
	if (/^\\\[[\s\S]*\\\]$/.test(v) || /^\$\$[\s\S]*\$\$$/.test(v) || /^\\\([\s\S]*\\\)$/.test(v)) {
		return v;
	}
	return `\\[${v}\\]`;
}

type FigureCtx = {
	paperId: string;
	questionId: string;
	blockIndex: number;
	invalidateQuestions: () => void;
	figureGenerationEnabled: boolean;
};

function FigureBlockView({
	data,
	ctx
}: {
	data: {
		caption: string;
		figure_label: string | null;
		status: string;
		svg: string | null;
		image_url: string | null;
		error_message: string | null;
	};
	ctx: FigureCtx;
}) {
	const { mutate: retryFigures, isPending: retrying } = api.paper.regeneratePaperFigures.useMutation({
		onSuccess: () => {
			ctx.invalidateQuestions();
			notifySuccess('figure-retry', 'Regenerating figures…', <IconCheck size={18} />);
		},
		onError: err => notifyError('figure-retry', err.message, <IconX size={18} />)
	});

	const sanitizedSvg =
		data.status === 'ready' && typeof data.svg === 'string' && data.svg.trim().length > 0
			? DOMPurify.sanitize(data.svg, { USE_PROFILES: { svg: true, svgFilters: true } })
			: '';

	return (
		<Stack gap='xs' className='eg-figure-block my-2'>
			<Group gap='xs'>
				{data.figure_label ? (
					<Badge size='xs' variant='outline'>
						{data.figure_label}
					</Badge>
				) : null}
				<Text size='sm' fw={500}>
					{data.caption}
				</Text>
			</Group>
			{data.status === 'pending' && ctx.figureGenerationEnabled ? (
				<>
					<Skeleton height={180} radius='md' animate />
					<Text size='xs' c='dimmed'>
						Generating diagram…
					</Text>
				</>
			) : null}
			{data.status === 'pending' && !ctx.figureGenerationEnabled ? (
				<Text size='sm' c='dimmed'>
					Diagram auto-generation is currently disabled.
				</Text>
			) : null}
		{data.status === 'failed' ? (
			<Stack gap='sm'>
				<Text size='sm' c='red'>
					{data.error_message ?? 'Could not generate this diagram.'}
				</Text>
				{ctx.figureGenerationEnabled ? (
					<Button
						size='xs'
						variant='light'
						leftSection={<IconRefresh size={14} />}
						loading={retrying}
						onClick={() => retryFigures({ paperId: ctx.paperId })}
					>
						Retry generation
					</Button>
				) : null}
			</Stack>
		) : null}
		{data.status === 'ready' && Boolean(sanitizedSvg) ? (
			<div
				className='max-w-full overflow-x-auto [&_svg]:max-h-[28rem]'
				dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
			/>
		) : null}
		{data.status === 'ready' && !sanitizedSvg && data.image_url ? (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={data.image_url}
				alt={data.caption}
				className='max-h-[28rem] max-w-full object-contain'
			/>
		) : null}
		{data.status === 'ready' && !sanitizedSvg && !data.image_url ? (
			<Text size='sm' c='dimmed'>
				No diagram preview available yet.
			</Text>
		) : null}
		{data.status === 'ready' && ctx.figureGenerationEnabled ? (
			<Button
				size='xs'
				variant='subtle'
				color='gray'
				leftSection={<IconRefresh size={14} />}
				loading={retrying}
				onClick={() => retryFigures({ paperId: ctx.paperId })}
			>
				Regenerate diagram
			</Button>
		) : null}
		</Stack>
	);
}

function BlockView({ block, figureCtx }: { block: unknown; figureCtx?: FigureCtx }) {
	if (!block || typeof block !== 'object' || !('kind' in block)) return null;
	const b = block as {
		kind: string;
		value?: string;
		caption?: string;
		headers?: string[];
		rows?: string[][];
		figure_label?: string | null;
		diagram_type?: string | null;
		svg?: string | null;
		image_url?: string | null;
		status?: string | null;
		error_message?: string | null;
	};
	switch (b.kind) {
		case 'text':
			return (
				<div className='eg-block-text'>
					<LatexHtml html={b.value ?? ''} />
				</div>
			);
		case 'math':
			return (
				<div className='eg-block-math my-2'>
					<LatexText block>{wrapBlockMath(b.value ?? '')}</LatexText>
				</div>
			);
		case 'image_placeholder':
			return (
				<Text size='sm' c='dimmed'>
					[Figure: {b.caption}]
				</Text>
			);
		case 'figure': {
			if (!figureCtx) {
				return (
					<Text size='sm' c='dimmed'>
						[Figure{(b.figure_label ?? b.caption) ? `: ${b.figure_label ?? b.caption ?? ''}` : ''}]
					</Text>
				);
			}
			const status = typeof b.status === 'string' ? b.status : 'pending';
			return (
				<FigureBlockView
					data={{
						caption: typeof b.caption === 'string' ? b.caption : 'Diagram',
						figure_label: b.figure_label ?? null,
						status,
						svg: b.svg ?? null,
						image_url: b.image_url ?? null,
						error_message: b.error_message ?? null
					}}
					ctx={figureCtx}
				/>
			);
		}
		case 'table':
			return (
				<table className='eg-table my-2 w-full border-collapse text-sm'>
					<thead>
						<tr>
							{(b.headers ?? []).map((h, i) => (
								<th key={i} className='border p-2 text-left'>
									<LatexText>{h ?? ''}</LatexText>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{(b.rows ?? []).map((row, ri) => (
							<tr key={ri}>
								{row.map((c, ci) => (
									<td key={ci} className='border p-2'>
										<LatexText>{c ?? ''}</LatexText>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			);
		default:
			return null;
	}
}

type Flags = { questionEdits: boolean; aiMarking: boolean; figureGenerationEnabled: boolean };

function QuestionSubtree({
	parentId,
	questions,
	depth,
	mode,
	attemptAnswers,
	onAnswerChange,
	flags,
	markSchemeByQuestionId,
	sessionFeedback,
	onFeedbackRecorded,
	paperId
}: {
	parentId: string | null;
	questions: Q[];
	depth: number;
	mode: 'study' | 'mock' | 'review';
	attemptAnswers?: Record<string, string>;
	onAnswerChange?: (questionId: string, text: string) => void;
	flags: Flags;
	markSchemeByQuestionId?: Map<string, MarkSchemeItem>;
	sessionFeedback: Record<string, QuestionFeedbackSentiment>;
	onFeedbackRecorded: (questionId: string, sentiment: QuestionFeedbackSentiment) => void;
	paperId: string;
}) {
	const nodes = useMemo(
		() =>
			questions
				.filter(q => (q.parent_id ?? null) === parentId)
				.sort((a, b) => a.order - b.order),
		[questions, parentId]
	);

	return (
		<Stack gap='md'>
			{nodes.map(node => (
				<QuestionNode
					key={node.question_id}
					node={node}
					depth={depth}
					questions={questions}
					mode={mode}
					attemptAnswers={attemptAnswers}
					onAnswerChange={onAnswerChange}
					flags={flags}
					markSchemeByQuestionId={markSchemeByQuestionId}
					sessionFeedback={sessionFeedback}
					onFeedbackRecorded={onFeedbackRecorded}
					paperId={paperId}
				/>
			))}
		</Stack>
	);
}

function QuestionNode({
	node,
	depth,
	questions,
	mode,
	attemptAnswers,
	onAnswerChange,
	flags,
	markSchemeByQuestionId,
	sessionFeedback,
	onFeedbackRecorded,
	paperId
}: {
	node: Q;
	depth: number;
	questions: Q[];
	mode: 'study' | 'mock' | 'review';
	attemptAnswers?: Record<string, string>;
	onAnswerChange?: (questionId: string, text: string) => void;
	flags: Flags;
	markSchemeByQuestionId?: Map<string, MarkSchemeItem>;
	sessionFeedback: Record<string, QuestionFeedbackSentiment>;
	onFeedbackRecorded: (questionId: string, sentiment: QuestionFeedbackSentiment) => void;
	paperId: string;
}) {
	const utils = api.useUtils();
	const invalidateQuestions = useCallback(() => {
		void utils.question.listForPaper.invalidate({ paperId });
	}, [utils, paperId]);
	const mobileDrawer = useMediaQuery('(max-width: 30em)');
	const [drawerOpen, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
	const [histOpen, { open: openHist, close: closeHist }] = useDisclosure(false);
	const [prompt, setPrompt] = useState('');
	const [preset, setPreset] = useState<string | null>(null);
	const [preserveMarks, setPreserveMarks] = useState(true);
	const [streamPreview, setStreamPreview] = useState('');
	const [streaming, setStreaming] = useState(false);

	const { mutateAsync: submitFeedback, isPending: feedbackSubmitting } = api.rating.submitQuestion.useMutation({
		onSuccess: (_data, variables) => {
			onFeedbackRecorded(node.question_id, variables.sentiment);
			void utils.question.listForPaper.invalidate({ paperId });
			captureRating('question', { questionId: node.question_id });
			notifySuccess(
				`question-feedback-${node.question_id}`,
				variables.sentiment === 1
					? 'Thanks — we saved your positive feedback for this question.'
					: 'Thanks — we saved your feedback for this question.',
				<IconCheck size={18} />
			);
		},
		onError: error => {
			const msg = error.message || 'Could not save feedback';
			notifyError(`question-feedback-err-${node.question_id}`, msg, <IconX size={18} />);
		}
	});

	const serverSentiment = node.feedback[0]?.sentiment;
	const recordedSentiment: QuestionFeedbackSentiment | undefined =
		serverSentiment === 1 || serverSentiment === -1
			? serverSentiment
			: sessionFeedback[node.question_id];
	const feedbackLocked = recordedSentiment !== undefined;

	const giveFeedback = (sentiment: QuestionFeedbackSentiment) => {
		if (feedbackLocked || feedbackSubmitting) return;
		void submitFeedback({
			questionId: node.question_id,
			sentiment,
			reason_tags: sentiment === -1 ? ['too_hard'] : []
		});
	};

	const { data: revisions = [] } = api.question.listRevisions.useQuery(
		{ questionId: node.question_id },
		{ enabled: histOpen }
	);

	const { mutateAsync: revert } = api.question.revertToRevision.useMutation({
		onSuccess: () => {
			void utils.question.listForPaper.invalidate({ paperId });
			closeHist();
		}
	});

	const body = Array.isArray(node.body) ? (node.body as unknown[]) : [];
	const showAnswerInput = flags.aiMarking && mode === 'mock';
	const showReview = flags.aiMarking && mode === 'review';
	const answerText = attemptAnswers?.[node.question_id];
	const markSchemeItem =
		mode === 'study' ? markSchemeByQuestionId?.get(node.question_id) : undefined;

	return (
		<Box
			pl={depth > 0 ? 'md' : 0}
			py='xs'
			data-question-id={node.question_id}
			className='rounded-md border border-transparent hover:border-gray-200 dark:hover:border-dark-600'
		>
			<Group justify='space-between' wrap='nowrap' mb={4}>
				<Group gap='xs'>
					{node.label && (
						<Text fw={600} size='sm'>
							{node.label}.
						</Text>
					)}
					<Badge size='xs' variant='light'>
						{node.marks} marks
					</Badge>
					{markSchemeItem ? (
						<MarkSchemeHintButton item={markSchemeItem} questionLabel={node.label} />
					) : null}
				</Group>
				<Menu shadow='md' width={240}>
					<Menu.Target>
						<ActionIcon
							variant='subtle'
							size='sm'
							aria-label='Question menu'
							aria-busy={feedbackSubmitting}
							color={feedbackLocked ? 'dimmed' : undefined}
						>
							<IconDotsVertical size={16} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						{flags.questionEdits && <Menu.Item onClick={openDrawer}>Edit with AI…</Menu.Item>}
						{flags.questionEdits && <Menu.Item onClick={openHist}>Revision history</Menu.Item>}
						{feedbackLocked ? (
							<Menu.Item
								disabled
								leftSection={<IconCheck size={14} />}
								closeMenuOnClick={false}
								style={{ opacity: 1 }}
							>
								{recordedSentiment === 1
									? 'Feedback recorded — you said this was helpful'
									: 'Feedback recorded — thanks for letting us know'}
							</Menu.Item>
						) : (
							<>
								<Menu.Item
									leftSection={<IconThumbUp size={14} />}
									disabled={feedbackSubmitting}
									onClick={() => giveFeedback(1)}
								>
									Thumbs up
								</Menu.Item>
								<Menu.Item
									leftSection={<IconThumbDown size={14} />}
									disabled={feedbackSubmitting}
									onClick={() => giveFeedback(-1)}
								>
									Thumbs down
								</Menu.Item>
							</>
						)}
					</Menu.Dropdown>
				</Menu>
			</Group>
			<Stack gap={6}>
				{body.map((bl, i) => (
					<BlockView
						key={i}
						block={bl}
						figureCtx={{
							paperId,
							questionId: node.question_id,
							blockIndex: i,
							invalidateQuestions,
							figureGenerationEnabled: flags.figureGenerationEnabled
						}}
					/>
				))}
			</Stack>
			{showAnswerInput && (
				<Textarea
					mt='sm'
					label='Your answer'
					minRows={3}
					value={answerText ?? ''}
					onChange={e => onAnswerChange?.(node.question_id, e.currentTarget.value)}
				/>
			)}
			{showReview && answerText != null && (
				<Text size='sm' mt='sm' c='dimmed'>
					Your answer: {answerText}
				</Text>
			)}
			<QuestionSubtree
				parentId={node.question_id}
				questions={questions}
				depth={depth + 1}
				mode={mode}
				attemptAnswers={attemptAnswers}
				onAnswerChange={onAnswerChange}
				flags={flags}
				markSchemeByQuestionId={markSchemeByQuestionId}
				sessionFeedback={sessionFeedback}
				onFeedbackRecorded={onFeedbackRecorded}
				paperId={paperId}
			/>
			<Drawer
				opened={drawerOpen}
				onClose={closeDrawer}
				title='Edit question'
				position={mobileDrawer ? 'bottom' : 'right'}
				size={mobileDrawer ? '100%' : 'md'}
			>
				<Stack>
					<Chip.Group
						multiple={false}
						value={preset}
						onChange={v => setPreset(typeof v === 'string' ? v : null)}
					>
						<Group>
							<Chip value='harder'>Make harder</Chip>
							<Chip value='easier'>Make easier</Chip>
							<Chip value='context'>Change context</Chip>
							<Chip value='wording'>Clearer wording</Chip>
							<Chip value='multipart'>Multi-part</Chip>
						</Group>
					</Chip.Group>
					<TextInput label='Instructions' value={prompt} onChange={e => setPrompt(e.currentTarget.value)} />
					<Checkbox
						label='Preserve marks'
						checked={preserveMarks}
						onChange={e => setPreserveMarks(e.currentTarget.checked)}
					/>
					{streaming || streamPreview ? (
						<Textarea
							label='Streaming preview'
							readOnly
							minRows={6}
							value={streamPreview}
							className='font-mono text-xs'
						/>
					) : null}
					<Button
						loading={streaming}
						onClick={() => {
							captureQuestionEdit('submitted', { questionId: node.question_id });
							void (async () => {
								setStreaming(true);
								setStreamPreview('');
								try {
									const res = await fetch('/api/question/edit', {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({
											questionId: node.question_id,
											userPrompt: prompt || 'Apply preset',
											preset: preset ?? undefined,
											preserveMarks
										})
									});
									if (!res.ok) {
										throw new Error(`Request failed (${res.status})`);
									}
									const reader = res.body?.getReader();
									const dec = new TextDecoder();
									let acc = '';
									if (reader) {
										while (true) {
											const { done, value } = await reader.read();
											if (done) break;
											acc += dec.decode(value, { stream: true });
											setStreamPreview(acc);
										}
									}
									void utils.question.listForPaper.invalidate({ paperId });
									notifySuccess('question-edit', 'Question updated', <IconCheck size={18} />);
									captureQuestionEdit('succeeded', { questionId: node.question_id });

									const revs = await utils.question.listRevisions.fetch({
										questionId: node.question_id
									});
									const target = revs[0];
									if (target) {
										const nid = `undo-q-${node.question_id}`;
										notifications.show({
											id: nid,
											title: 'Question updated',
											message: (
												<Group gap='xs'>
													<Button
														size='xs'
														variant='light'
														onClick={() => {
															notifications.hide(nid);
															void revert({
																questionId: node.question_id,
																revision: target.revision
															});
														}}
													>
														Undo
													</Button>
												</Group>
											),
											autoClose: 10_000,
											withCloseButton: true
										});
									}
									closeDrawer();
									setStreamPreview('');
								} catch (e) {
									const msg = e instanceof Error ? e.message : 'Edit failed';
									notifyError('question-edit', msg, <IconX size={18} />);
									captureQuestionEdit('failed', { questionId: node.question_id });
								} finally {
									setStreaming(false);
								}
							})();
						}}
					>
						Apply
					</Button>
				</Stack>
			</Drawer>
			<Modal opened={histOpen} onClose={closeHist} title='Revision history'>
				<Stack>
					{revisions.map(r => (
						<Group key={r.id} justify='space-between'>
							<Text size='sm'>
								r{r.revision} — {r.marks} marks
							</Text>
							<Button
								size='xs'
								variant='light'
								onClick={() => void revert({ questionId: node.question_id, revision: r.revision })}
							>
								Restore
							</Button>
						</Group>
					))}
				</Stack>
			</Modal>
		</Box>
	);
}

export function QuestionTree({
	questions,
	mode,
	attemptAnswers,
	onAnswerChange,
	flags,
	markSchemeByQuestionId,
	paperId
}: {
	questions: Q[];
	mode: 'study' | 'mock' | 'review';
	attemptAnswers?: Record<string, string>;
	onAnswerChange?: (questionId: string, text: string) => void;
	flags: Flags;
	markSchemeByQuestionId?: Map<string, MarkSchemeItem>;
	paperId: string;
}) {
	const [sessionFeedback, setSessionFeedback] = useState<Record<string, QuestionFeedbackSentiment>>({});
	const onFeedbackRecorded = useCallback((questionId: string, sentiment: QuestionFeedbackSentiment) => {
		setSessionFeedback(prev => ({ ...prev, [questionId]: sentiment }));
	}, []);

	return (
		<QuestionSubtree
			parentId={null}
			questions={questions}
			depth={0}
			mode={mode}
			attemptAnswers={attemptAnswers}
			onAnswerChange={onAnswerChange}
			flags={flags}
			markSchemeByQuestionId={markSchemeByQuestionId}
			sessionFeedback={sessionFeedback}
			onFeedbackRecorded={onFeedbackRecorded}
			paperId={paperId}
		/>
	);
}
