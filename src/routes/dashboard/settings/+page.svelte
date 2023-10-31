<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './constants.js';
	import type { ActionData } from './$types.js';
	import { Check, Cog, Loader2, Sparkles } from 'lucide-svelte';
	import { goto, invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { PUBLIC_FREE_TIER_CREDITS, PUBLIC_PREMIUM_TIER_CREDITS } from '$env/static/public';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { premiumDialogOpen } from '$lib/stores';
	import axios from 'axios';

	let settingsForm: SuperValidated<FormSchema>;

	export let data;
	export let form: ActionData;

	let subscriptionData = data.data.userSubscriptionData;
	let completeUserData = data.data;
	let userData = completeUserData.userData;
	let planStatus = completeUserData.code;

	let unfornattedDate: Date;
	let expiryDate: string;
	let daysLeft: number;

	const formatDate = (date: Date) => {
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
		const day = date.getDate();
		const month = months[date.getMonth() - 1];
		const year = date.getFullYear();
		return `${day} ${month}, ${year}`;
	};

	const daysLeftToExpire = (date: Date) => {
		const today = new Date();
		const diffTime = Math.abs(date.getTime() - today.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	if (subscriptionData?.stripeCurrentPeriodEnd) {
		unfornattedDate = subscriptionData?.stripeCurrentPeriodEnd!;
		expiryDate = formatDate(unfornattedDate);
		daysLeft = daysLeftToExpire(unfornattedDate);
	}

	let username = data.session?.user?.name;

	let submitting = false;

	$: {
		if (!form?.form?.valid || form?.status === 'SAME_NAME' || form?.status === 'INVALID_FORM') {
			submitting = false;
		}

		if (form?.status === 'SUCCESS') {
			submitting = false;
			invalidate('/dashboard/settings');
		}
	}

	let loading = false;

	const onSubscribe = async () => {
		try {
			loading = true;
			const response = await axios.get('/api/checkout');
			if (response) {
				goto(response.data.url);
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading = false;
		}
	};
</script>

<div class="p-4 h-full">
	<div class="flex flex-col gap-10">
		<div class="max-w-4xl w-full mx-auto">
			<Card.Root class="w-full">
				<Form.Root
					schema={formSchema}
					form={settingsForm}
					let:config
					method="POST"
					on:submit={() => {
						submitting = true;
					}}
				>
					<div class="flex items-center justify-between">
						<div>
							<Card.Header>
								<Card.Title>Profile</Card.Title>
							</Card.Header>
							<Card.Content>
								<Card.Description class="space-y-4">
									<Form.Field {config} name="username">
										<Form.Item class="w-[215px] md:w-[260px]">
											<Form.Label>Username</Form.Label>
											<div class="flex items-center space-x-2">
												<Form.Input
													value={username}
													class="h-8 text-secondary-foreground focus-visible:ring-offset-0"
												/>
												{#if form?.status === 'SUCCESS' && !submitting}
													<Check class="h-5 w-5 text-green-500" />
												{:else if submitting}
													<Loader2 class="h-5 w-5 animate-spin" />
												{/if}
											</div>
											<!-- <Form.Description>Username should be 4 to 32 characters long</Form.Description
											> -->
											<Form.Validation />
										</Form.Item>
									</Form.Field>
									<div class="space-y-2">
										<Label class="text-sm">Email</Label>
										<Input
											type="text"
											value={data.session?.user?.email}
											disabled
											class="h-8 text-secondary-foreground disabled:cursor-default disabled:opacity-100"
										/>
									</div>
								</Card.Description>
							</Card.Content>
						</div>
						<div class="mr-4">
							<Avatar.Root class="h-16 w-16 md:h-20 md:w-20">
								<Avatar.Image src={data.session?.user?.image} alt={`${data.session?.user?.name}`} />
								<Avatar.Fallback>
									{`${data.session?.user?.name?.split(' ')[0][0]}${
										data.session?.user?.name?.split(' ')[1][0]
									}`}
								</Avatar.Fallback>
							</Avatar.Root>
						</div>
					</div>
					<Separator />
					<div class="flex items-center justify-end p-2">
						<Form.Button type="submit">
							{#if submitting}
								<Loader2 class="h-5 w-5 animate-spin mr-2" />
							{/if}
							{#if form?.status === 'SUCCESS' && !submitting}
								<Check class="h-5 w-5 text-green-500 mr-2" />
							{/if}
							Save
						</Form.Button>
					</div>
				</Form.Root>
			</Card.Root>
		</div>
		<div class="max-w-4xl w-full mx-auto">
			<Card.Root>
				<div class="flex items-center justify-between">
					<div class="w-full">
						<Card.Header>
							<Card.Title>Subscription</Card.Title>
						</Card.Header>
						<Card.Content>
							<Card.Description>
								<div class="mb-3 flex items-center justify-between gap-2">
									<div>
										<span class="text-base">Current Plan: </span>
										{#if planStatus === 'FREE_TIER'}
											<span class="text-base">Free Tier</span>
										{:else if planStatus === 'FREE_TIER_LIMIT_REACHED'}
											<span class="text-red-600 text-base">Free Tier (Limit Reached)</span>
										{:else if planStatus === 'SUBSCRIPTION_VALID'}
											<span class="text-green-600 text-base">Premium (Active)</span>
										{:else if planStatus === 'SUBSCRIPTION_EXPIRED'}
											<span class="text-red-600 text-base">Premium (Expired)</span>
										{/if}
									</div>
									<div>
										<div>
											<Card.Root>
												<Card.Header class="space-y-3 p-2">
													{#if planStatus === 'FREE_TIER' || planStatus === 'FREE_TIER_LIMIT_REACHED'}
														<Card.Title
															class="text-base flex flex-col items-center justify-center gap-2"
														>
															<Progress
																value={userData?.creditsUsed}
																max={Number(PUBLIC_FREE_TIER_CREDITS)}
																class="border-2"
															/>
															<p class="text-muted-foreground text-sm">
																{userData?.creditsUsed} / {PUBLIC_FREE_TIER_CREDITS} free credits
															</p>
														</Card.Title>
													{/if}

													{#if planStatus === 'SUBSCRIPTION_VALID'}
														<Card.Title class="flex items-center justify-between gap-2">
															<p class="text-muted-foreground text-sm">
																Expires on {expiryDate} ({daysLeft} days left)
															</p>
														</Card.Title>
													{/if}

													{#if planStatus === 'SUBSCRIPTION_EXPIRED'}
														<Card.Title class="flex items-center justify-between gap-2">
															<p class="text-muted-foreground text-sm text-red-600">
																Plan Expired on {expiryDate}
															</p>
														</Card.Title>
													{/if}
												</Card.Header>
											</Card.Root>
										</div>
									</div>
								</div>
								{#if planStatus === 'SUBSCRIPTION_VALID'}
									<Card.Title class="text-primary py-3">Premium credits usage</Card.Title>
									<div
										class="flex flex-col md:flex-row border p-3 rounded-xl mx-auto justify-between gap-4"
									>
										<div>
											<Progress
												value={subscriptionData?.imageGenerationCreditsUsed}
												max={Number(PUBLIC_PREMIUM_TIER_CREDITS)}
												class="border-2"
											/>
											<p class="text-muted-foreground text-sm text-center">
												{subscriptionData?.imageGenerationCreditsUsed} /
												{PUBLIC_PREMIUM_TIER_CREDITS} Image Generation Credits used
											</p>
										</div>
										<div>
											<Progress
												value={subscriptionData?.audioGenerationCreditsUsed}
												max={Number(PUBLIC_PREMIUM_TIER_CREDITS)}
												class="border-2"
											/>
											<p class="text-muted-foreground text-sm text-center">
												{subscriptionData?.audioGenerationCreditsUsed} /
												{PUBLIC_PREMIUM_TIER_CREDITS} Audio Generation Credits used
											</p>
										</div>
										<div>
											<Progress
												value={subscriptionData?.imageRestorationCreditsUsed}
												max={Number(PUBLIC_PREMIUM_TIER_CREDITS)}
												class="border-2"
											/>
											<p class="text-muted-foreground text-sm text-center">
												{subscriptionData?.imageRestorationCreditsUsed} /
												{PUBLIC_PREMIUM_TIER_CREDITS} Image Restoration Credits used
											</p>
										</div>
									</div>
								{/if}
							</Card.Description>
						</Card.Content>
					</div>
				</div>
				<Separator />
				<div class="flex items-center justify-end p-2">
					{#if planStatus === 'FREE_TIER' || planStatus === 'FREE_TIER_LIMIT_REACHED'}
						<Button
							variant="gradient"
							on:click={() => {
								$premiumDialogOpen = true;
							}}
						>
							Upgrade
							<Sparkles class="ml-2 h-5 w-5" />
						</Button>
					{/if}

					{#if planStatus === 'SUBSCRIPTION_VALID' || planStatus === 'SUBSCRIPTION_EXPIRED'}
						<Button on:click={onSubscribe}>
							Manage Subscription
							<Cog class={`ml-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
						</Button>
					{/if}
				</div>
			</Card.Root>
		</div>
	</div>
</div>
