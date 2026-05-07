import Stripe from 'stripe';

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
	apiVersion: '2026-04-22.dahlia'
});

export default stripe;
