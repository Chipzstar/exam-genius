import { loadStripe, Stripe, StripeConstructorOptions } from '@stripe/stripe-js';
import { env } from '~/env';

let stripePromise: Promise<Stripe | null>;
const getStripe = (config?: StripeConstructorOptions) => {
	if (!stripePromise) {
		stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, config);
	}
	return stripePromise;
};

export default getStripe;
