import { openai } from "$lib/api-providers";
import { incrementCreditsUsed } from "$lib/db/utils";
import { OpenAIStream, StreamingTextResponse } from "ai";


export const config = {
	runtime: "edge"
}
export const POST = async (event) => {
	try {
		const { user } = await event.locals.getSession();
		if (!user) {
			return new Response("Unauthorized", { status: 401 });
		}
		const { messages } = await event.request.json();

		const { userData, userSubscriptionData } = event.locals.completeUserData;
		console.log(userSubscriptionData)
		const subscriptionStatus = event.locals.completeUserData.code;

		if (subscriptionStatus === "FREE_TIER_LIMIT_REACHED") {
			return new Response("FREE_TIER_LIMIT_REACHED", { status: 402 });
		}

		if (subscriptionStatus === "SUBSCRIPTION_EXPIRED") {
			return new Response("SUBSCRIPTION_EXPIRED", { status: 402 });
		}

		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			stream: true,

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			messages: messages.map((message: any) => ({
				content: message.content,
				role: message.role,
			})),
		});

		if (subscriptionStatus === "FREE_TIER") {
			await incrementCreditsUsed({
				email: user.email as string,
				userData: userData,
			});
		}

		const stream = OpenAIStream(response);
		return new StreamingTextResponse(stream);
	} catch (error) {
		console.log(error);
	}
};
