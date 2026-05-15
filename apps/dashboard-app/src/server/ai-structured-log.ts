import { env } from '~/env';

/**
 * Same contract as exam-genius-backend `logAiStructured`: console + optional Axiom dataset ingest,
 * so AI events from the dashboard land in the same observability pipe.
 */
export function logAiStructured(event: string, fields: Record<string, unknown>): void {
	const row = {
		event,
		ts: new Date().toISOString(),
		source: 'dashboard',
		...fields
	};

	// eslint-disable-next-line no-console
	console.info('ai_structured', JSON.stringify(row));

	const token = env.AXIOM_TOKEN;
	const dataset = env.AXIOM_DATASET;
	if (!token || !dataset) return;

	void fetch(`https://api.axiom.co/v1/datasets/${encodeURIComponent(dataset)}/ingest`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify([row])
	}).catch(() => {
		/* ignore ingest errors */
	});
}
