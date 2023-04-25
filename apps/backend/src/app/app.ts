import * as path from 'path';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import AutoLoad from '@fastify/autoload';

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
	// Place here your custom code!
	fastify.get('/openai/generate', async function (request: FastifyRequest, reply: FastifyReply) {
		return { message: 'Hello API' };
	});
	// Do not touch the following lines

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'plugins'),
		options: { ...opts }
	});

	// This loads all plugins defined in routes
	// define your routes in one of these
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'routes'),
		options: { ...opts }
	});
}
