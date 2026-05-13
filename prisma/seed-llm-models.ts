import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@exam-genius/shared/prisma';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error('DATABASE_URL is required to run seed-llm-models');
}

const prisma = new PrismaClient({
	accelerateUrl: databaseUrl,
	log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
}).$extends(withAccelerate());

const rows = [
	{
		key: 'paper_generate',
		model_id: 'gpt-5-mini',
		provider: 'openai',
		description: 'Paper question generation'
	},
	{
		key: 'mark_scheme',
		model_id: 'gpt-5-mini',
		provider: 'openai',
		description: 'Mark scheme generation'
	},
	{
		key: 'legacy_parse',
		model_id: 'gpt-4o-mini',
		provider: 'openai',
		description: 'Legacy HTML paper parsing'
	},
	{
		key: 'attempt_marking',
		model_id: 'gpt-5-mini',
		provider: 'openai',
		description: 'Student attempt AI marking'
	},
	{
		key: 'figure_svg',
		model_id: 'gpt-5-mini',
		provider: 'openai',
		description: 'Figure diagram SVG code generation'
	}
] as const;

async function main(): Promise<void> {
	for (const r of rows) {
		await prisma.llmModelConfig.upsert({
			where: { key: r.key },
			create: {
				key: r.key,
				model_id: r.model_id,
				provider: r.provider,
				description: r.description,
				is_active: true
			},
			update: {
				model_id: r.model_id,
				provider: r.provider,
				description: r.description,
				is_active: true
			}
		});
	}
	console.info('[seed-llm-models] upserted', rows.length);
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
