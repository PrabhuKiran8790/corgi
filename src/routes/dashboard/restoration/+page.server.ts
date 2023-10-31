import { PUBLIC_PREMIUM_TIER_CREDITS } from '$env/static/public';
import { replicate } from '$lib/api-providers';
import { incrementCreditsUsed } from '$lib/db/utils';
import { fail, type Actions } from '@sveltejs/kit';

export const config = {
	runtime: 'edge'
};


export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const uploadedFileURL = data.get('uploaded_file_url');

		const { user } = await locals.getSession();
		const { userData, userSubscriptionData, code } = locals.completeUserData;
		const subscriptionStatus = code;

		if (
			subscriptionStatus === 'FREE_TIER_LIMIT_REACHED' ||
			subscriptionStatus === 'SUBSCRIPTION_EXPIRED'
		) {
			return fail(402, { error: subscriptionStatus });
		}

		if (
			userSubscriptionData &&
			(userSubscriptionData?.imageRestorationCreditsUsed as number) >=
				Number(PUBLIC_PREMIUM_TIER_CREDITS)
		) {
			return fail(402, {
				error: 'PREMIUM_TIER_LIMIT_REACHED'
			});
		}

		try {
			const output = await replicate.run(
				'tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3',
				{
					input: {
						img: uploadedFileURL
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
						service: 'imageRestoration',
						increment: 1
					},
					userSubscriptionData: userSubscriptionData
				});
			}


			return { uploadedFileURL, output };
		} catch (error) {
			console.log(error);
		}
	}
};
