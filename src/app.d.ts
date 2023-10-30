// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			completeUserData: {
				code: string;
				status: boolean;
				userData: {
					id: string;
					name: string | null;
					email: string;
					emailVerified: Date | null;
					image: string | null;
					createdAt: Date | null;
					creditsUsed: number;
				} | null;
				userSubscriptionData: {
					id: string;
					email: string;
					stripeCustomerId: string;
					stripeSubscriptionId: string;
					stripePriceId: string | null;
					stripeCurrentPeriodEnd: Date;
					imageGenerationCreditsUsed: number;
					audioGenerationCreditsUsed: number;
					imageRestorationCreditsUsed: number;
				} | null;
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
