'use client';

import Page from '~/layout/Page';
import { Badge, Button, Card, Group, Select, Stack, Table, Text, Title } from '@mantine/core';
import { api } from '~/trpc/react';
import { UploadButton } from '~/utils/uploadthing';
import { useMemo, useState } from 'react';
import { notifyError, notifySuccess } from '~/utils/functions';
import { IconCheck, IconTrash, IconX } from '@tabler/icons-react';

export default function ReferencesPage() {
	const [courseId, setCourseId] = useState<string | null>(null);
	const [kind, setKind] = useState<'question_paper' | 'mark_scheme' | 'examiner_report'>('question_paper');

	const { data: courses = [] } = api.course.getCourses.useQuery();
	const courseOptions = useMemo(
		() => courses.map(c => ({ value: c.course_id, label: `${c.subject} · ${c.exam_board}` })),
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
								placeholder='Choose a course'
								data={courseOptions}
								value={courseId}
								onChange={setCourseId}
								searchable
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
									Select a course to enable uploads.
								</Text>
							)}
						</Stack>
					</Card>

					{courseId ? (
						<Card withBorder p={0}>
							<Table striped highlightOnHover>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>File</Table.Th>
										<Table.Th>Kind</Table.Th>
										<Table.Th>Status</Table.Th>
										<Table.Th w={100} />
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{isLoading ? (
										<Table.Tr>
											<Table.Td colSpan={4}>
												<Text size='sm'>Loading…</Text>
											</Table.Td>
										</Table.Tr>
									) : refs.length === 0 ? (
										<Table.Tr>
											<Table.Td colSpan={4}>
												<Text size='sm' c='dimmed'>
													No references yet for this course.
												</Text>
											</Table.Td>
										</Table.Tr>
									) : (
										refs.map(r => (
											<Table.Tr key={r.reference_id}>
												<Table.Td>{r.filename}</Table.Td>
												<Table.Td>{r.kind}</Table.Td>
												<Table.Td>
													<Badge size='sm' variant='light'>
														{r.status}
													</Badge>
												</Table.Td>
												<Table.Td>
													<Group justify='flex-end'>
														<Button
															size='xs'
															color='red'
															variant='light'
															leftSection={<IconTrash size={14} />}
															loading={removing}
															onClick={() => void removeRef({ referenceId: r.reference_id })}
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
					) : null}
				</Stack>
			</Page.Body>
		</Page.Container>
	);
}
