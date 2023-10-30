import { NEXTAUTH_URL, STRIPE_PRICE_ID } from '$env/static/private';
import { stripe } from '$lib/api-providers.js';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	try {
		const session = await locals.getSession();
		if (!session || !session.user) {
			return json(
				{
					data: {
						CODE: 'NOT_AUTHENTICATED',
						message: 'You are not authenticated.'
					}
				},
				{ status: 401 }
			);
		}

		const { userSubscriptionData } = locals.completeUserData;


		// if the user has a subscription, redirect them to the Stripe billing portal
		if (userSubscriptionData && userSubscriptionData.stripeCustomerId) {
			const stripeSession = await stripe.billingPortal.sessions.create({
				customer: userSubscriptionData.stripeCustomerId,
				return_url: `${NEXTAUTH_URL}/dashboard/settings`
			});

			return json({ url: stripeSession.url });
		}

		const stripeSession = await stripe.checkout.sessions.create({
			success_url: `${NEXTAUTH_URL}/dashboard/?success=true`,
			cancel_url: `${NEXTAUTH_URL}/dashboard/?canceled=true`,
			payment_method_types: ['card'],
			mode: 'subscription',
			billing_address_collection: 'auto',
			customer_email: session.user.email as string,
			line_items: [
				{
					// price_data: {
					// 	currency: 'USD',
					// 	product_data: {
					// 		name: 'Corgi AI Premium',
					// 		description: "Get access to all of Corgi AI's premium features."
					// 	},
					// 	unit_amount: 14 * 100, // $14.00
					// 	recurring: {
					// 		interval: 'month'
					// 	}
					// },
					price: STRIPE_PRICE_ID,
					quantity: 1
				}
			],
			metadata: {
				email: session.user.email as string
			}
		});

		return json({ url: stripeSession.url });
	} catch (error) {
		return json(
			{
				data: {
					CODE: 'UNKNOWN_ERROR',
					message: error
				}
			},
			{ status: 500 }
		);
	}
}
