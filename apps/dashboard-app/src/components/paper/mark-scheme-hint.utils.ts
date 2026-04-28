export type MarkSchemePoint = { description: string; marks: number };

export type MarkSchemeItem = {
	question_id: string;
	model_answer?: string;
	points: MarkSchemePoint[];
};

export function parseMarkSchemeModelAnswer(raw: unknown): { byId: Map<string, MarkSchemeItem>; order: string[] } {
	const byId = new Map<string, MarkSchemeItem>();
	const order: string[] = [];
	if (raw == null || typeof raw !== 'object') return { byId, order };
	const items = (raw as { items?: unknown }).items;
	if (!Array.isArray(items)) return { byId, order };

	for (const it of items) {
		if (it == null || typeof it !== 'object') continue;
		const qid = (it as { question_id?: unknown }).question_id;
		if (typeof qid !== 'string' || !qid) continue;
		const modelRaw = (it as { model_answer?: unknown }).model_answer;
		const model_answer = typeof modelRaw === 'string' ? modelRaw : undefined;
		const pointsRaw = (it as { points?: unknown }).points;
		const points: MarkSchemePoint[] = [];
		if (Array.isArray(pointsRaw)) {
			for (const p of pointsRaw) {
				if (p == null || typeof p !== 'object') continue;
				const desc = (p as { description?: unknown }).description;
				const m = (p as { marks?: unknown }).marks;
				if (typeof desc === 'string' && typeof m === 'number' && Number.isFinite(m)) {
					points.push({ description: desc, marks: m });
				}
			}
		}
		byId.set(qid, { question_id: qid, model_answer, points });
		order.push(qid);
	}
	return { byId, order };
}
