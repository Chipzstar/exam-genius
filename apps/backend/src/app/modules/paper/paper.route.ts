import { FastifyInstance } from 'fastify';
import { generatePaper } from './paper.controller';

async function paperRoutes(server: FastifyInstance) {
	server.post('/generate', generatePaper);
}

export default paperRoutes;
