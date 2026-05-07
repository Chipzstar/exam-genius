/**
 * Prisma Accelerate cache tags: alphanumeric + underscores only, max 64 chars per tag.
 * @see https://www.prisma.io/docs/accelerate/reference/api-reference#cachestrategy
 */
function toAccelerateTag(raw: string): string {
	const sanitized = raw.replace(/[^a-zA-Z0-9_]/g, '_');
	return sanitized.length <= 64 ? sanitized : sanitized.slice(0, 64);
}

export function questionsForPaperListTag(paperId: string): string {
	return toAccelerateTag(`qpaper_${paperId}`);
}

export function referencesListTag(userId: string, courseId?: string): string {
	return toAccelerateTag(courseId ? `refs_${userId}_${courseId}` : `refs_${userId}_all`);
}
