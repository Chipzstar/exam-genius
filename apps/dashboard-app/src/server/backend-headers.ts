import axios from 'axios';
import { env } from '~/env';

const HEADER = 'x-exam-genius-secret';

const headers: Record<string, string> = {
	'Content-Type': 'application/json'
};
if (env.BACKEND_SHARED_SECRET) {
	headers[HEADER] = env.BACKEND_SHARED_SECRET;
}

/** Axios instance for server-side calls to exam-genius-backend (base URL + auth header). */
export const backendApi = axios.create({
	baseURL: env.BACKEND_HOST,
	headers
});
