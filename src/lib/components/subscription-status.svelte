<script lang="ts">
	import { PUBLIC_FREE_TIER_CREDITS } from '$env/static/public';
	import * as Card from '$lib/components/ui/card';
	import { darkmode, premiumDialogOpen, toLink } from '$lib/stores';
	import { Cog, Sparkles } from 'lucide-svelte';
	import { Button } from './ui/button';
	import { Progress } from './ui/progress';
	import { cn } from '$lib/utils';
	import { navigating } from '$app/stores';

	export let subscriptionStatus: string;
	export let credits: number;
</script>

{#if subscriptionStatus === 'FREE_TIER' || subscriptionStatus === 'FREE_TIER_LIMIT_REACHED'}
	<div class="p-3 md:py-3">
		<Card.Root class={`dark:bg-black ${!$darkmode && 'grainy'}`}>
			<Card.Header class="space-y-3 p-2">
				<Card.Title class="text-base flex flex-col items-center justify-center gap-2">
					<h1>{credits} / {PUBLIC_FREE_TIER_CREDITS} free credits</h1>
					<Progress value={credits} max={5} class="border-2" />
				</Card.Title>
				<Card.Description>
					<Button
						variant="gradient"
						class="w-full text-white"
						data-sveltekit-preload-data
						on:click={() => {
							$premiumDialogOpen = true;
						}}
					>
						Purchase Premium
						<Sparkles class="w-5 h-5 ml-2" />
					</Button>
				</Card.Description>
			</Card.Header>
		</Card.Root>
	</div>
{/if}

{#if subscriptionStatus === 'SUBSCRIPTION_VALID' || subscriptionStatus === 'SUBSCRIPTION_EXPIRED'}
	<div class="p-3 md:py-3">
		<Card.Root class={`dark:bg-black ${!$darkmode && 'grainy'}`}>
			<Card.Header class="space-y-3 p-2">
				<Card.Description>
					<Button
						class="w-full bg-muted-foreground/20 dark:bg-secondary text-secondary-foreground hover:bg-muted-foreground/40 dark:hover:bg-secondary/80"
						data-sveltekit-preload-data
						href="/dashboard/settings"
						on:click={() => {
							$toLink = '/dashboard/settings';
						}}
					>
						Manage Subscription
						<Cog
							class={cn(
								'w-5 h-5 ml-2',
								$navigating && $toLink === '/dashboard/settings' && 'animate-spin'
							)}
						/>
					</Button>
				</Card.Description>
			</Card.Header>
		</Card.Root>
	</div>
{/if}
