import { eq } from "drizzle-orm";
import { db } from ".";
import { userSubscription, users } from "./schema";
import { PUBLIC_FREE_TIER_CREDITS } from "$env/static/public";

export type userDataType = {
	id: string;
	name: string | null;
	email: string;
	emailVerified: Date | null;
	image: string | null;
	createdAt: Date | null;
	creditsUsed: number;
} | null;

export type userSubscriptionDataType = {
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

export const getUserData = async (email: string) => {
	const data = await db.select().from(users).where(eq(users.email, email));
	return data[0];
};

export const getSubscriptionData = async (email: string) => {
	const data = await db
		.select()
		.from(userSubscription)
		.where(eq(userSubscription.email, email));
	return data[0];
};

export const getUserAndSubscriptionInfo = async (email: string) => {
	if (!email) {
		return {
			data: {
				code: "NO_EMAIL",
				status: false,
			},
		};
	}

	const userData = await getUserData(email);

	if (!userData) {
		return {
			data: {
				code: "NO_USER_DATA",
				status: false,
			},
		};
	}

	const userSubscriptionData = await getSubscriptionData(email);

	if (
		userData.creditsUsed < Number(PUBLIC_FREE_TIER_CREDITS) &&
		!userSubscriptionData
	) {
		return {
			data: {
				code: "FREE_TIER",
				status: true,
				userData: userData,
				userSubscriptionData: userSubscriptionData,
			},
		};
	}

	if (
		userData.creditsUsed >= Number(PUBLIC_FREE_TIER_CREDITS) &&
		!userSubscriptionData
	) {
		return {
			data: {
				code: "FREE_TIER_LIMIT_REACHED",
				status: false,
				userData: userData,
				userSubscriptionData: userSubscriptionData,
			},
		};
	}

	if (
		!userSubscriptionData ||
		!userSubscriptionData.stripeCurrentPeriodEnd ||
		!userSubscriptionData.stripeSubscriptionId
	) {
		return {
			data: {
				code: "NO_SUBSCRIPTION",
				status: false,
				userData: userData,
				userSubscriptionData: userSubscriptionData,
			},
		};
	}

	const DAY_IN_MS = 1000 * 60 * 60 * 24;

	const isValid =
		userSubscriptionData.stripePriceId !== null &&
		userSubscriptionData.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS >
			Date.now();

	return {
		data: {
			code: isValid ? "SUBSCRIPTION_VALID" : "SUBSCRIPTION_EXPIRED",
			status: isValid,
			userData: userData,
			userSubscriptionData: userSubscriptionData,
		},
	};
};

export const incrementCreditsUsed = async ({
	userData,
	userSubscriptionData,
	email,
	serviceType,
}: {
	userData: userDataType;
	userSubscriptionData?: userSubscriptionDataType;
	email: string;
	serviceType?: {
		increment: number;
		service: "image" | "audio" | "imageRestoration";
	};
}) => {
	if (!serviceType) {
		await db
			.update(users)
			.set({
				creditsUsed: (userData?.creditsUsed as number) + 1,
			})
			.where(eq(users.email, email));
		return;
	}

	if (serviceType && serviceType.service === "image") {
		await db
			.update(userSubscription)
			.set({
				imageGenerationCreditsUsed:
					(userSubscriptionData?.imageGenerationCreditsUsed as number) + 1,
			})
			.where(eq(userSubscription.email, email));
		return;
	}

	if (serviceType && serviceType.service === "audio") {
		await db
			.update(userSubscription)
			.set({
				audioGenerationCreditsUsed:
					(userSubscriptionData?.audioGenerationCreditsUsed as number) + 1,
			})
			.where(eq(userSubscription.email, email));
		return;
	}

	if (serviceType && serviceType.service === "imageRestoration") {
		await db
			.update(userSubscription)
			.set({
				imageRestorationCreditsUsed:
					(userSubscriptionData?.imageRestorationCreditsUsed as number) + 1,
			})
			.where(eq(userSubscription.email, email));
		return;
	}
};
