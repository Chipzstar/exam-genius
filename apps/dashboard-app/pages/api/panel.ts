import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "../../server/routers/_app";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
	res.status(200).send(
		renderTrpcPanel(appRouter, {
			url: "http://localhost:4200/api/trpc",
			transformer: "superjson",
		})
	);
}
