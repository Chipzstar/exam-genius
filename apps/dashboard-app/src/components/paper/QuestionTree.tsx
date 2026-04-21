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
	Checkbox
} from '@mantine/core';
import { IconDotsVertical, IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import type { RouterOutputs } from '~/trpc/react';
import { api } from '~/trpc/react';
import { useMemo, useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { notifyError, notifySuccess } from '~/utils/functions';
import { IconCheck, IconX } from '@tabler/icons-react';
import { captureQuestionEdit, captureRating } from '~/utils/posthog-events';

const PAPER_HTML_SANITIZE: DOMPurify.Config = {
	USE_PROFILES: { html: true }
};

type Q = RouterOutputs['question']['listForPaper'][number];

function BlockView({ block }: { block: unknown }) {
	if (!block || typeof block !== 'object' || !('kind' in block)) return null;
	const b = block as {
		kind: string;
		value?: string;
		caption?: string;
		headers?: string[];
		rows?: string[][];
	};
	switch (b.kind) {
		case 'text':
			return (
				<div className='eg-block-text'>
					{parse(DOMPurify.sanitize(b.value ?? '', PAPER_HTML_SANITIZE), { trim: true })}
				</div>
			);
		case 'math':
			return (
				<Text component='pre' size='sm' className='whitespace-pre-wrap font-mono'>
					{b.value}
				</Text>
			);
		case 'image_placeholder':
			return (
				<Text size='sm' c='dimmed'>
					[Figure: {b.caption}]
				</Text>
			);
		case 'table':
			return (
				<table className='eg-table my-2 w-full border-collapse text-sm'>
					<thead>
						<tr>
							{(b.headers ?? []).map((h, i) => (
								<th key={i} className='border p-2 text-left'>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{(b.rows ?? []).map((row, ri) => (
							<tr key={ri}>
								{row.map((c, ci) => (
									<td key={ci} className='border p-2'>
										{c}
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

type Flags = { questionEdits: boolean; aiMarking: boolean };

function QuestionSubtree({
	parentId,
	questions,
	depth,
	mode,
	attemptAnswers,
	onAnswerChange,
	flags
}: {
	parentId: string | null;
	questions: Q[];
	depth: number;
	mode: 'study' | 'mock' | 'review';
	attemptAnswers?: Record<string, string>;
	onAnswerChange?: (questionId: string, text: string) => void;
	flags: Flags;
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
	flags
}: {
	node: Q;
	depth: number;
	questions: Q[];
	mode: 'study' | 'mock' | 'review';
	attemptAnswers?: Record<string, string>;
	onAnswerChange?: (questionId: string, text: string) => void;
	flags: Flags;
}) {
	const utils = api.useUtils();
	const mobileDrawer = useMediaQuery('(max-width: 30em)');
	const [drawerOpen, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
	const [histOpen, { open: openHist, close: closeHist }] = useDisclosure(false);
	const [prompt, setPrompt] = useState('');
	const [preset, setPreset] = useState<string | null>(null);
	const [preserveMarks, setPreserveMarks] = useState(true);
	const [streamPreview, setStreamPreview] = useState('');
	const [streaming, setStreaming] = useState(false);

	const { mutateAsync: submitFeedback } = api.rating.submitQuestion.useMutation({
		onSuccess: () => captureRating('question', { questionId: node.question_id })
	});

	const { data: revisions = [] } = api.question.listRevisions.useQuery(
		{ questionId: node.question_id },
		{ enabled: histOpen }
	);

	const { mutateAsync: revert } = api.question.revertToRevision.useMutation({
		onSuccess: () => {
			void utils.question.listForPaper.invalidate();
			closeHist();
		}
	});

	const body = Array.isArray(node.body) ? (node.body as unknown[]) : [];
	const showAnswerInput = flags.aiMarking && mode === 'mock';
	const showReview = flags.aiMarking && mode === 'review';
	const answerText = attemptAnswers?.[node.question_id];

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
				</Group>
				<Menu shadow='md' width={220}>
					<Menu.Target>
						<ActionIcon variant='subtle' size='sm' aria-label='Question menu'>
							<IconDotsVertical size={16} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						{flags.questionEdits && <Menu.Item onClick={openDrawer}>Edit with AI…</Menu.Item>}
						{flags.questionEdits && <Menu.Item onClick={openHist}>Revision history</Menu.Item>}
						<Menu.Item
							leftSection={<IconThumbUp size={14} />}
							onClick={() =>
								void submitFeedback({ questionId: node.question_id, sentiment: 1, reason_tags: [] })
							}
						>
							Thumbs up
						</Menu.Item>
						<Menu.Item
							leftSection={<IconThumbDown size={14} />}
							onClick={() =>
								void submitFeedback({
									questionId: node.question_id,
									sentiment: -1,
									reason_tags: ['too_hard']
								})
							}
						>
							Thumbs down
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
			<Stack gap={6}>
				{body.map((bl, i) => (
					<BlockView key={i} block={bl} />
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
									void utils.question.listForPaper.invalidate();
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
	flags
}: {
	questions: Q[];
	mode: 'study' | 'mock' | 'review';
	attemptAnswers?: Record<string, string>;
	onAnswerChange?: (questionId: string, text: string) => void;
	flags: Flags;
}) {
	return (
		<QuestionSubtree
			parentId={null}
			questions={questions}
			depth={0}
			mode={mode}
			attemptAnswers={attemptAnswers}
			onAnswerChange={onAnswerChange}
			flags={flags}
		/>
	);
}
