import { ExamBoard, Subject } from '@exam-genius/shared/utils';
import { getQueryClient } from '~/trpc/query-client';
import { api, HydrateClient } from '~/trpc/server';
import PaperClient from './PaperClient';

interface PageProps {
	params: { course_id: string; unit: string; paper: string };
	searchParams: { code?: string; subject?: string; board?: string };
}

export default async function PaperPage({ params, searchParams }: PageProps) {
	const code = searchParams.code ?? '';
	const subject = (searchParams.subject ?? '') as Subject;
	const board = (searchParams.board ?? '') as ExamBoard;

	// Fetch data on the server
	const trpcApi = await api();
	const initialPapers = await trpcApi.paper.getPapersByCode({ courseId: params.course_id, code });

	// Prefetch data for React Query
	const queryClient = getQueryClient();
	await queryClient.prefetchQuery({
		queryKey: [['paper', 'getPapersByCode'], { input: { courseId: params.course_id, code }, type: 'query' }],
		queryFn: () => initialPapers
	});

	return (
		<HydrateClient>
			<PaperClient
				params={params}
				searchParams={{ code, subject, board }}
				initialPapers={initialPapers}
			/>
		</HydrateClient>
	);
}

