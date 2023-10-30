<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import { getRoutes } from '$lib/config';
	import { darkmode, toLink } from '$lib/stores';
	import { cn } from '$lib/utils';

	import corgiTyping from '$lib/assets/corgi-typing-no-bg.png';
	import SubscriptionStatus from '$lib/components/subscription-status.svelte';
	import { Loader2 } from 'lucide-svelte';

	export let credits: number;
	export let subscriptionStatusCode: string;
	let routes = getRoutes();
</script>

<div class={`flex flex-col w-full dark:bg-black ${!$darkmode && 'grainy'} overflow-x-auto`}>
	<div class="px-3 py-2 flex-1">
		<a href="/dashboard" class="mb-5 flex items-center gap-0 space-x-0">
			<div class="relative w-24 h-24">
				<img src={corgiTyping} alt="Corgi" />
			</div>
			<div>
				<h1 class="gfont text-4xl">Corgi</h1>
			</div>
		</a>
		<!-- route -->
		<div class="space-y-1.5 -mt-2">
			{#each routes as route (route.href)}
				<a
					data-sveltekit-preload-data
					href={route.href}
					on:click={() => {
						$toLink = route.href;
					}}
					class={cn(
						buttonVariants({
							variant: 'ghost'
						}),
						'w-full',
						`${
							$page.url.pathname === route.href
								? 'bg-foreground/10 text-foreground font-semibold tracking-wide transition-all duration-500 hover:bg-foreground/5'
								: 'hover:bg-foreground/10 text-foreground/60'
						}`
					)}
				>
					<div class="flex items-center flex-1 gap-2 relative">
						<svelte:component
							this={route.icon}
							class={cn(
								'w-7 h-7',
								route.color,
								$navigating && $toLink === '/dashboard/settings' && route.otherStyles
							)}
						/>
						<div class="ml-2 flex justify-between items-center w-full">
							<div>
								{route.label}
							</div>
							{#if $navigating && $toLink === route.href}
								<div>
									<Loader2 class="h-5 w-5 animate-spin" />
								</div>
							{/if}
						</div>
						{#if route.status}
							<Badge class="absolute top-0 -right-2">{route.status}</Badge>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	</div>
	<SubscriptionStatus {credits} subscriptionStatus={subscriptionStatusCode} />
</div>
