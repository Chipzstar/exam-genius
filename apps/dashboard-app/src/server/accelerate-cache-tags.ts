/**
 * Prisma Accelerate cache tags: alphanumeric + underscores only, max 64 chars per tag.
 * @see https://www.prisma.io/docs/accelerate/reference/api-reference#cachestrategy
 */
export function questionsForPaperListTag(paperId: string): string {
	const suffix = paperId.replace(/[^a-zA-Z0-9_]/g, '_');
	const tag = `qpaper_${suffix}`;
	return tag.length <= 64 ? tag : tag.slice(0, 64);
}
