import { openai } from '$lib/api-providers';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { imageFormSchema } from './constants';
import { PUBLIC_PREMIUM_TIER_CREDITS } from '$env/static/public';
import { incrementCreditsUsed } from '$lib/db/utils';
import type { PageServerLoad } from './$types';

type ImageSizes = '256x256' | '512x512' | '1024x1024';
function convertToImageType(inputValue: string): ImageSizes {
	const imageSize: ImageSizes = inputValue as ImageSizes;
	return imageSize;
}

export const load: PageServerLoad = async () => {
	return {
		imageForm: await superValidate(imageFormSchema)
	};
};

export const config = {
	runtime: 'edge'
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, imageFormSchema);
		if (!form.valid) {
			return fail(400, {
				form,
				error: 'INVALID_FORM'
			});
		}

		const { prompt, count, resolution } = form.data;

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
			(userSubscriptionData?.imageGenerationCreditsUsed as number) >=
				Number(PUBLIC_PREMIUM_TIER_CREDITS)
		) {
			return fail(402, {
				form,
				error: 'PREMIUM_TIER_LIMIT_REACHED'
			});
		}

		const image = await openai.images.generate({
			prompt: prompt,
			n: Number(count),
			size: convertToImageType(resolution)
		});

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
					service: 'image',
					increment: 1
				},
				userSubscriptionData: userSubscriptionData
			});
		}

		console.log(image.data);
		return { form, prompt, count, resolution, image };
	}
};
