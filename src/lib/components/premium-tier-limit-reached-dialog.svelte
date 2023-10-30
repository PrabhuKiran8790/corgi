<script lang="ts">
	import type { userSubscriptionDataType } from '$lib/db/utils';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getRoutes } from '$lib/config';
	import { premiumTierLimitDialogOpen } from '$lib/stores';
	import { cn } from '$lib/utils';
	import { BadgeAlert } from 'lucide-svelte';
	import { Progress } from './ui/progress';
	import { PUBLIC_PREMIUM_TIER_CREDITS } from '$env/static/public';

	const routes = getRoutes(['/dashboard', '/dashboard/chat', '/dashboard/settings']);

	export let userSubscriptionData: userSubscriptionDataType;

	let credits: number;

	$: {
		if ($premiumTierLimitDialogOpen.serviceType === 'image') {
			credits = userSubscriptionData?.imageGenerationCreditsUsed as number;
		} else if ($premiumTierLimitDialogOpen.serviceType === 'audio') {
			credits = userSubscriptionData?.imageGenerationCreditsUsed as number;
		} else if ($premiumTierLimitDialogOpen.serviceType === 'imageRestoration') {
			credits = userSubscriptionData?.imageGenerationCreditsUsed as number;
		}
	}
</script>

<Dialog.Root
	open={$premiumTierLimitDialogOpen.open}
	onOpenChange={() => {
		$premiumTierLimitDialogOpen.open = false;
	}}
>
	<Dialog.Overlay class="opacity-[0.05]" />
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>
				{#each routes as route (route.href)}
					{#if route.href === $page.url.pathname}
						<div class="flex items-center space-x-3">
							<svelte:component
								this={route.icon}
								class={cn('w-8 h-8 rounded-lg p-1', route.color, route.background_color)}
							/>
							<div>
								{route.label}
							</div>
						</div>
					{/if}
				{/each}
			</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="flex items-center justify-center gap-4">
				<BadgeAlert />
				<div>
					<h1>Insufficient Credits</h1>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center gap-4">
				<p class="text-center">you've used all the availabe premium credits for this month</p>
				<Progress value={credits} max={Number(PUBLIC_PREMIUM_TIER_CREDITS)} class="border-2" />
				<p class="text-muted-foreground text-sm text-center">
					{credits} /
					{PUBLIC_PREMIUM_TIER_CREDITS} Credits used
				</p>
			</div>
		</div>
		<Dialog.Footer>
			<Button
				type="submit"
				on:click={() => {
					$premiumTierLimitDialogOpen.open = false;
				}}>Close</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
