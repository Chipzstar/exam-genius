import Fastify from 'fastify';
import cors from '@fastify/cors';
import { app } from './app/app';
import paperRoutes from './app/modules/paper/paper.route';
import fastifyEnv from '@fastify/env';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const schema = {
	type: 'object',
	required: ['OPENAI_API_KEY'],
	properties: {
		OPENAI_API_KEY: {
			type: 'string'
		}
	}
}

const options = {
	confKey: 'config',
	dotenv: true,
	schema,
	data: process.env
}

// Instantiate Fastify with some config
const server = Fastify({
	logger: true
});

server.register(fastifyEnv, options)
server.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
})

// Register your application as a normal plugin.
server.register(app);

server.get("/healthcheck", async function () {
	return { status: "OK" };
})

server.register(paperRoutes, {prefix: '/server/paper'})

// Start listening.
server.listen({ port, host }, err => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	} else {
		console.log(`[ ready ] https://${host}:${port}`);
	}
});
