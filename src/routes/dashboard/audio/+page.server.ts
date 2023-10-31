import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { AudioSchema } from './constants';

import { replicate } from '$lib/api-providers';
import { PUBLIC_PREMIUM_TIER_CREDITS } from '$env/static/public';
import type { PageServerLoad } from '../$types';
import { incrementCreditsUsed } from '$lib/db/utils';

export const load: PageServerLoad = async () => {
	return {
		audioForm: await superValidate(AudioSchema),
	};
};

export const config = {
	runtime: 'edge'
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, AudioSchema);
		if (!form.valid) {
			return fail(400, {
				form,
				error: 'Invalid form data'
			});
		}

		const { prompt } = form.data;

		const { user } = await event.locals.getSession();
		const { userData, userSubscriptionData, code } = event.locals.completeUserData;
		const subscriptionStatus = code;

		if (
			subscriptionStatus === 'FREE_TIER_LIMIT_REACHED' ||
			subscriptionStatus === 'SUBSCRIPTION_EXPIRED'
		) {
			return fail(402, { form, error: subscriptionStatus });
		}

		if (
			userSubscriptionData &&
			(userSubscriptionData?.audioGenerationCreditsUsed as number) >=
				Number(PUBLIC_PREMIUM_TIER_CREDITS)
		) {
			return fail(402, {
				form,
				error: 'PREMIUM_TIER_LIMIT_REACHED'
			});
		}

		const output = await replicate.run(
			'meta/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906',
			{
				input: {
					model_version: 'melody',
					prompt: prompt
				}
			}
		);

		if (subscriptionStatus === 'FREE_TIER') {
			await incrementCreditsUsed({
				email: user?.email as string,
				userData: userData
			});
		} else if (subscriptionStatus === 'SUBSCRIPTION_VALID') {
			await incrementCreditsUsed({
				email: user?.email as string,
				userData: userData,
				serviceType: {
					service: 'audio',
					increment: 1
				},
				userSubscriptionData: userSubscriptionData
			});
		}

		return { form, prompt, output };
	}
};
