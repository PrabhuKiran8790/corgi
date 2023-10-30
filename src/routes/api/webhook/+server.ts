import type { Stripe } from 'stripe';
import { stripe } from '$lib/api-providers';
import { json } from '@sveltejs/kit';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { db } from '$lib/db/index.js';
import { userSubscription } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';
import {v4 as uuidv4} from 'uuid';

export async function POST({ request }) {
	const body = await request.text();
	const signature = request.headers.get('Stripe-Signature') as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (error) {
		return json(
			{ CODE: 'INVALID_SIGNATURE', message: 'The signature is invalid.' },
			{ status: 400 }
		);
	}

	const session = event.data.object as Stripe.Checkout.Session;

	console.log(event.type);

	if (event.type === 'checkout.session.completed') {
		const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

		if (!session?.metadata?.email) {
			return json(
				{ CODE: 'MISSING_METADATA', message: 'The session metadata is missing.' },
				{ status: 400 }
			);
		}

		// await db.userSubscription.create({
		// 	data: {
		// 		email: session?.metadata?.email as string,
				// stripeSubscriptionId: subscription.id,
				// stripeCustomerId: subscription.customer as string,
				// stripePriceId: subscription.items.data[0].price.id,
				// stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
		// 	}
		// });

		await db.insert(userSubscription).values({
			id: uuidv4(),
			email: session?.metadata?.email as string,
			stripeSubscriptionId: subscription.id,
			stripeCustomerId: subscription.customer as string,
			stripePriceId: subscription.items.data[0].price.id,
			stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
		})
	}

	if (event.type === 'invoice.payment_succeeded') {
		const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

		// await db.userSubscription.update({
		// 	where: {
		// 		stripeSubscriptionId: session.id
		// 	},
		// 	data: {
		// 		stripePriceId: subscription.items.data[0].price.id,
		// 		stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
		// 	}
		// });

		await db.update(userSubscription).set({
			stripePriceId: subscription.items.data[0].price.id,
			stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
		}).where(eq(userSubscription.stripeSubscriptionId, session.id))
	}

	return json({ received: true }, { status: 200 });
}
