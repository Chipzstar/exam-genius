/**
 * Re-export next-axiom Logger for server-side use (tRPC, handlers without request context).
 * In route handlers, use withAxiom and req.log instead.
 */
export { Logger } from 'next-axiom';
