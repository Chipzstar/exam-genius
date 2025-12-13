import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "~/server/api/routers/_app";

export async function GET() {
	return new Response(
		renderTrpcPanel(appRouter, {
			url: process.env.VERCEL_URL
				? `https://${process.env.VERCEL_URL}/api/trpc`
				: `http://localhost:${process.env.PORT ?? 4200}/api/trpc`,
			transformer: "superjson",
		}),
		{
			headers: {
				'Content-Type': 'text/html',
			},
		}
	);
}

