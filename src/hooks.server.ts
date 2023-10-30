import {
	AUTH_SECRET,
	GITHUB_ID,
	GITHUB_SECRET,
	GOOGLE_ID,
	GOOGLE_SECRET
} from '$env/static/private';
import { db } from '$lib/db';
import { getUserAndSubscriptionInfo } from '$lib/db/utils';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authorization({ event, resolve }: { event: any; resolve: any }) {
	if (event.url.pathname.startsWith('/dashboard')) {
		const session = await event.locals.getSession();
		const fromUrl = event.url.pathname + event.url.search;
		if (!session?.user) {
			throw redirect(303, `/login?redirectTo=${fromUrl}`);
		}
	}
	return resolve(event);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserAndSubscriptionData = async ({ event, resolve }: { event: any; resolve: any }) => {
	const session = await event.locals.getSession();
	if (session && session.user) {
		const { data } = await getUserAndSubscriptionInfo(session.user.email);

		event.locals.completeUserData = data;
	}
	return resolve(event);
};

export const handle = sequence(
	SvelteKitAuth({
		adapter: DrizzleAdapter(db),
		providers: [
			GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
			Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })
		],
		trustHost: true,
		secret: AUTH_SECRET
	}),
	authorization,
	getUserAndSubscriptionData
);
