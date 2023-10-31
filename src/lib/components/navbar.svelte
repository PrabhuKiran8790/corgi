<script lang="ts">
	import { MobileSidebar, UserButton } from '$lib/components';
	import { getRoutes } from '$lib/config';
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	let routes = getRoutes(['/dashboard']);

	export let subscriptionStatusCode: string;
	export let credits: number;
</script>

<div
	class="text-foreground/60 bg-white dark:bg-black border-b top-0 p-2 right-0 left-0 h-20 z-50 flex items-center justify-between fixed md:ml-72"
>
	<MobileSidebar {subscriptionStatusCode} {credits} />
	<div class="flex-1">
		{#each routes as route (route.href)}
			<div class={$page.url.pathname === route.href ? 'border-0 shadow-none ml-2' : 'hidden'}>
				<div class="flex items-center justify-between">
					<div class="flex items-center justify-center gap-3">
						<svelte:component
							this={route.icon}
							class={cn('w-8 h-8 rounded-lg p-1', route.color, route.background_color)}
						/>
						<div class="relative flex flex-col">
							<h1 class="text-foreground">{route.label}</h1>
							<p class="text-muted-foreground text-sm hidden md:block">
								{#if route.description}
									{route.description}
								{/if}
							</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div class="flex justify-end mr-2">
		<UserButton />
	</div>
</div>
