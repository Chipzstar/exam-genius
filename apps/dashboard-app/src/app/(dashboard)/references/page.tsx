'use client';

import Page from '~/layout/Page';
import { Badge, Button, Card, Center, Group, Loader, Select, Stack, Table, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { api } from '~/trpc/react';
import { UploadButton } from '~/utils/uploadthing';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notifyError, notifySuccess, capitalize } from '~/utils/functions';
import { IconBooks, IconCheck, IconExternalLink, IconFileStack, IconTrash, IconX } from '@tabler/icons-react';
import type { Course } from '@exam-genius/shared/prisma';
import type { ExamBoard, ExamLevel } from '@exam-genius/shared/utils';
import { formatExamBoardForDisplay, formatExamLevelForDisplay } from '@exam-genius/shared/utils';
import { PATHS } from '~/utils/constants';
import { useExamLevelSelectionFlag } from '~/hooks/useExamLevelSelectionFlag';
import { appStore$ } from '~/store/app.store';

const REFERENCE_KIND_LABEL: Record<'question_paper' | 'mark_scheme' | 'examiner_report', string> = {
	question_paper: 'Question paper',
	mark_scheme: 'Mark scheme',
	examiner_report: 'Examiner report'
};

function formatCourseSelectLabel(course: Pick<Course, 'subject' | 'exam_board' | 'exam_level'>): string {
	const subject = capitalize(course.subject as string);
	const board = formatExamBoardForDisplay(course.exam_board);
	const level = formatExamLevelForDisplay(course.exam_level);
	return `${subject} · ${board} · ${level}`;
}

function openReferenceDeleteConfirm(opts: {
	referenceId: string;
	filename: string;
	remove: (input: { referenceId: string }) => Promise<unknown>;
}) {
	const label = opts.filename.trim() ? `"${opts.filename.trim()}"` : 'this reference';
	modals.openConfirmModal({
		modalId: `confirm-delete-reference-${opts.referenceId}`,
		title: 'Delete reference?',
		children: (
			<Text size='sm' c='dimmed'>
				{label} will be permanently removed. This cannot be undone.
			</Text>
		),
		labels: { confirm: 'Delete reference', cancel: 'Cancel' },
		confirmProps: { color: 'red' },
		onConfirm: () => void opts.remove({ referenceId: opts.referenceId })
	});
}

export default function ReferencesPage() {
	const router = useRouter();
	const [courseId, setCourseId] = useState<string | null>(null);
	const [kind, setKind] = useState<'question_paper' | 'mark_scheme' | 'examiner_report'>('question_paper');

	const { enabled: examLevelSelectionEnabled, ready: examLevelFlagReady } = useExamLevelSelectionFlag();
	const goAddCourse = useCallback(() => {
		if (!examLevelFlagReady) return;
		if (!examLevelSelectionEnabled) {
			appStore$.onboarding.examLevel.set('a_level');
			router.push(PATHS.NEW_SUBJECT);
			return;
		}
		router.push(PATHS.CHOOSE_EXAM_LEVEL);
	}, [examLevelFlagReady, examLevelSelectionEnabled, router]);

	const { data: courses = [], isLoading: coursesLoading } = api.course.getCourses.useQuery();
	const courseOptions = useMemo(
		() =>
			[...courses]
				.sort((a, b) => {
					const bySubject = a.subject.localeCompare(b.subject);
					if (bySubject !== 0) return bySubject;
					const byBoard = a.exam_board.localeCompare(b.exam_board);
					if (byBoard !== 0) return byBoard;
					return a.exam_level.localeCompare(b.exam_level);
				})
				.map(c => ({ value: c.course_id, label: formatCourseSelectLabel(c) })),
		[courses]
	);

	const { data: refs = [], isLoading, refetch } = api.reference.list.useQuery(
		courseId ? { courseId } : undefined,
		{ enabled: Boolean(courseId) }
	);

	const { mutateAsync: removeRef, isPending: removing } = api.reference.remove.useMutation({
		onSuccess: () => {
			void refetch();
			notifySuccess('ref-removed', 'Reference removed', <IconCheck size={18} />);
		},
		onError: err => notifyError('ref-remove', err.message, <IconX size={18} />)
	});

	return (
		<Page.Container extraClassNames='py-6'>
			<Page.Body>
				<Stack gap='lg'>
					<Title order={2}>Reference PDFs</Title>
					<Text size='sm' c='dimmed'>
						Upload past papers or mark schemes to steer generation. Text is extracted on the server; duplicates
						are merged automatically.
					</Text>

					<Card withBorder p='md'>
						<Stack gap='md'>
							<Select
								label='Course'
								placeholder={
									coursesLoading
										? 'Loading courses…'
										: courses.length === 0
											? 'Add a course to upload references'
											: 'Choose a course'
								}
								description={
									courses.length === 0 && !coursesLoading
										? 'References are tied to a subject, exam board, and level. Add a course from your dashboard first.'
										: undefined
								}
								data={courseOptions}
								value={courseId}
								onChange={setCourseId}
								searchable
								disabled={coursesLoading || courses.length === 0}
							/>
							<Select
								label='Document kind'
								data={[
									{ value: 'question_paper', label: 'Question paper' },
									{ value: 'mark_scheme', label: 'Mark scheme' },
									{ value: 'examiner_report', label: 'Examiner report' }
								]}
								value={kind}
								onChange={v => setKind((v ?? 'question_paper') as typeof kind)}
								disabled={courses.length === 0 && !coursesLoading}
							/>
							{courseId ? (
								<UploadButton
									endpoint='paperReference'
									input={{ courseId, kind }}
									onClientUploadComplete={() => {
										void refetch();
										notifySuccess('ref-upload', 'Upload complete — extracting…', <IconCheck size={18} />);
									}}
									onUploadError={err => notifyError('ref-upload', err.message, <IconX size={18} />)}
								/>
							) : (
								<Text size='sm' c='dimmed'>
									{courses.length === 0
										? 'Once you have a course, pick it here to upload PDFs.'
										: 'Select a course to enable uploads.'}
								</Text>
							)}
						</Stack>
					</Card>

					<Card withBorder p={0}>
						<Table striped highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>File</Table.Th>
									<Table.Th>Kind</Table.Th>
									<Table.Th>Status</Table.Th>
									<Table.Th w={200} />
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{coursesLoading ? (
									<Table.Tr>
										<Table.Td colSpan={4}>
											<Center py='xl'>
												<Loader size='sm' />
											</Center>
										</Table.Td>
									</Table.Tr>
								) : courses.length === 0 ? (
									<Table.Tr>
										<Table.Td colSpan={4}>
											<Stack align='center' gap='md' py='xl' px='md'>
												<IconBooks size={40} stroke={1.25} style={{ opacity: 0.35 }} />
												<Stack gap={4} align='center' maw={420}>
													<Text fw={600}>No courses yet</Text>
													<Text size='sm' c='dimmed' ta='center'>
														Add at least one course so you can attach reference PDFs for that subject,
														board, and exam level.
													</Text>
												</Stack>
												<Group gap='sm'>
													<Button variant='default' component={Link} href={PATHS.HOME}>
														Back to dashboard
													</Button>
													<Button onClick={goAddCourse} disabled={!examLevelFlagReady} loading={!examLevelFlagReady}>
														Add a course
													</Button>
												</Group>
											</Stack>
										</Table.Td>
									</Table.Tr>
								) : !courseId ? (
									<Table.Tr>
										<Table.Td colSpan={4}>
											<Stack align='center' gap='sm' py='xl' px='md'>
												<IconFileStack size={36} stroke={1.25} style={{ opacity: 0.35 }} />
												<Text fw={600}>Choose a course</Text>
												<Text size='sm' c='dimmed' ta='center' maw={400}>
													Select a subject above to see existing uploads and add new reference PDFs.
												</Text>
											</Stack>
										</Table.Td>
									</Table.Tr>
								) : isLoading ? (
									<Table.Tr>
										<Table.Td colSpan={4}>
											<Center py='md'>
												<Loader size='sm' />
											</Center>
										</Table.Td>
									</Table.Tr>
								) : refs.length === 0 ? (
									<Table.Tr>
										<Table.Td colSpan={4}>
											<Stack align='center' gap='sm' py='xl' px='md'>
												<Text fw={600}>No references for this course</Text>
												<Text size='sm' c='dimmed' ta='center' maw={420}>
													Upload a question paper, mark scheme, or examiner report. Text is extracted on the
													server and merged when you upload the same file again.
												</Text>
											</Stack>
										</Table.Td>
									</Table.Tr>
								) : (
									refs.map(r => (
										<Table.Tr key={r.reference_id}>
											<Table.Td>{r.filename}</Table.Td>
											<Table.Td>{REFERENCE_KIND_LABEL[r.kind] ?? r.kind}</Table.Td>
											<Table.Td>
												<Badge size='sm' variant='light'>
													{r.status}
												</Badge>
											</Table.Td>
											<Table.Td>
												<Group justify='flex-end' gap='xs' wrap='nowrap'>
													<Button
														size='xs'
														variant='light'
														component='a'
														href={r.ut_url}
														target='_blank'
														rel='noopener noreferrer'
														leftSection={<IconExternalLink size={14} />}
													>
														View
													</Button>
													<Button
														size='xs'
														color='red'
														variant='light'
														leftSection={<IconTrash size={14} />}
														loading={removing}
														disabled={removing}
														onClick={() =>
															openReferenceDeleteConfirm({
																referenceId: r.reference_id,
																filename: r.filename,
																remove: removeRef
															})
														}
													>
														Delete
													</Button>
												</Group>
											</Table.Td>
										</Table.Tr>
									))
								)}
							</Table.Tbody>
						</Table>
					</Card>
				</Stack>
			</Page.Body>
		</Page.Container>
	);
}
