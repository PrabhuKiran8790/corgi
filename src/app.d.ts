// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { userDataType, userSubscriptionDataType } from '$lib/db/utils';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			completeUserData: {
				code: string;
				status: boolean;
				userData: userDataType;
				userSubscriptionData: userSubscriptionDataType;
			};

			getSession: () => Promise<{
				user?: {
					name?: string | null;
					email?: string | null;
					image?: string | null;
				};
				expires: ISODateString;
			}>;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
