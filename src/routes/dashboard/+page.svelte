<script>
	import { Badge } from '$lib/components/ui/badge';
	import { getRoutes } from '$lib/config';
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card';
	import { ArrowRight, Loader2 } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { navigating } from '$app/stores';
	import { toLink } from '$lib/stores';

	let routes = getRoutes(['/dashboard', '/dashboard/settings']);
</script>

<MetaTags
	title="Dashboard | Corgi AI"
	description="Create anything with AI"
	openGraph={{
		title: 'Dashboard | Corgi AI',
		description: 'Create anything with AI',
		images: [
			{
				url: 'https://raw.githubusercontent.com/PrabhuKiran8790/corgi/main/static/corgi-home-min.png',
				width: 800,
				height: 600,
				alt: 'Og Image Alt'
			}
		],
		siteName: 'Corgi AI'
	}}
	twitter={{
		handle: '@prabhukirantwt',
		site: '@corgi-ai',
		cardType: 'summary_large_image',
		title: 'Dashboard | Corgi AI',
		description: 'Create anything with AI',
		image: 'https://raw.githubusercontent.com/PrabhuKiran8790/corgi/main/static/corgi-home-min.png',
		imageAlt: 'Twitter image alt'
	}}
/>

<div class="mt-4 mb-8 lg:mt-10">
	<div class="w-full p-3 mb-8 space-y-2 text-center">
		<h2 class="font-sans text-2xl font-extrabold text-center md:text-4xl text-foreground/90">
			Create anything, with AI
		</h2>
		<p class="text-sm text-muted-foreground">
			use our AI to create anything you want, from images to text, we got you covered
		</p>
		<!-- <pre>{JSON.stringify($page.data)}</pre> -->
	</div>
	<div class="w-full px-4 space-y-4 md:px-20 lg:px-32">
		{#each routes as route (route.href)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<a
				href={route.href}
				class="rounded-lg cursor-pointer block"
				data-sveltekit-preload-data
				on:click={() => {
					$toLink = route.href;
				}}
			>
				<Card.Root class="dark:bg-foreground/5 hover:bg-foreground/5 dark:hover:bg-foreground/10">
					<Card.Header class="py-[21px]">
						<div class="flex items-center justify-between">
							<div class="flex items-center justify-center gap-5">
								<svelte:component this={route.icon} class={cn('w-8 h-8 rounded-lg', route.color)} />
								<div class="relative flex flex-col">
									{#if route.status}
										<Badge class="absolute right-0 -top-3">{route.status}</Badge>
									{/if}
									<h1>{route.label}</h1>
									<Card.Description>{route.description}</Card.Description>
								</div>
							</div>
							{#if $navigating && route.href === $toLink}
								<Loader2 class="w-6 h-6 animate-spin" />
							{:else}
								<ArrowRight class="w-6 h-6" />
							{/if}
						</div></Card.Header
					>
				</Card.Root>
			</a>
		{/each}
	</div>
</div>
