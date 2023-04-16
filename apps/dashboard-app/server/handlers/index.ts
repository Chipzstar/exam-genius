import Stripe from 'stripe';

export const validateLineItems = async (
	price_id: string
): Promise<{
	line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
	mode: Stripe.Checkout.SessionCreateParams.Mode;
}> => {
	try {
		const mode: Stripe.Checkout.SessionCreateParams.Mode = 'payment';
		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
		/*// check if the user is already subscribed to a plan
		// if not subscribed add, the Genius Plan product to the checkout
		if (user.stripe_subscription_status !== 'active') {
			line_items.push({
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				price: 'price_1MvmiEJOIoW2Wbjc8fdJPWer',
				quantity: 1
			});
			// set mode of the checkout session to "subscription
			mode = 'subscription';
		}*/
		line_items.push({
			price: price_id,
			quantity: 1
		});
		return { line_items, mode };
	} catch (err) {
		console.error(err);
		throw err;
	}
};
