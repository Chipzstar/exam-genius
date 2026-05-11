import { ExamBoard, Subject } from '@exam-genius/shared/utils';
import { getQueryClient } from '~/trpc/query-client';
import { api, HydrateClient } from '~/trpc/server';
import PaperClient from './PaperClient';

interface PageProps {
	params: Promise<{ course_id: string; unit: string; paper: string }>;
	searchParams: Promise<{ code?: string; subject?: string; board?: string; mode?: string }>;
}

export default async function PaperPage({ params, searchParams }: PageProps) {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const code = resolvedSearchParams.code ?? '';
	const subject = (resolvedSearchParams.subject ?? '') as Subject;
	const board = (resolvedSearchParams.board ?? '') as ExamBoard;
	const mode = resolvedSearchParams.mode;

	const caller = await api();
	const [initialPapers, initialCourse] = await Promise.all([
		caller.paper.getPapersByCode({ courseId: resolvedParams.course_id, code }),
		caller.course.getSingleCourse({ id: resolvedParams.course_id })
	]);
	const courseExamLevel = initialCourse.exam_level ?? 'a_level';

	// Prefetch data for React Query
	const queryClient = getQueryClient();
	await queryClient.prefetchQuery({
		queryKey: [['paper', 'getPapersByCode'], { input: { courseId: resolvedParams.course_id, code }, type: 'query' }],
		queryFn: () => Promise.resolve(initialPapers)
	});

	return (
		<HydrateClient>
			<PaperClient
				params={resolvedParams}
				searchParams={{ code, subject, board, mode }}
				initialPapers={initialPapers}
				courseExamLevel={courseExamLevel}
			/>
		</HydrateClient>
	);
}

