<script lang="ts">
	import DialogFooter from './../lib/components/ui/dialog/dialog-footer.svelte';
	import { page } from '$app/stores';
	import corgiTyping from '$lib/assets/corgi-typing-no-bg.png';
	import { Button } from '$lib/components/ui/button';
	import { getRoutes } from '$lib/config';
	import { Sparkles } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { pricingDialogOpen } from '$lib/stores';
	import { PricingDialog } from '$lib/components';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let routes = getRoutes(['/dashboard', '/dashboard/settings']);

	onMount(() => {
		window.document.documentElement.classList.add('dark');
	});
</script>

<MetaTags
	title="Corgi AI"
	description="Create anything with AI"
	openGraph={{
		title: 'Corgi AI',
		description: 'Create anything with AI',
		images: [
			{
				url: 'https://raw.githubusercontent.com/PrabhuKiran8790/corgi/main/static/corgi-home-min.png',
				width: 800,
				height: 500,
				alt: 'Og Image Alt'
			}
		],
		siteName: 'Corgi AI'
	}}
	twitter={{
		handle: '@prabhukirantwt',
		site: '@corgi-ai',
		cardType: 'summary_large_image',
		title: 'Corgi AI',
		description: 'Create anything with AI',
		image: 'https://raw.githubusercontent.com/PrabhuKiran8790/corgi/main/static/corgi-home-min.png',
		imageAlt: 'Twitter image alt'
	}}
/>

<div class="bg-[#080808] min-h-screen">
	<!-- navbar -->
	<div class="border-b">
		<div class="max-w-7xl h-20 mx-auto px-2">
			<div class="flex items-center justify-between h-full">
				<div class="flex items-center">
					<div class="relative w-16 h-16">
						<img src={corgiTyping} alt="Corgi" />
					</div>
					<div>
						<h1 class="gfont text-3xl">Corgi</h1>
					</div>
				</div>
				<div>
					<Button
						class="bg-zinc-800/95 hover:bg-zinc-900 text-white"
						href={$page.data.session ? '/dashboard' : '/login'}>Get Started</Button
					>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-12 p-3">
		<div class="flex flex-col items-center justify-center space-y-9">
			<div>
				<span class="bg-zinc-800 rounded-full p-1 px-3"> we are in beta 🚧</span>
			</div>
			<h1 class="text-5xl lg:text-7xl font-bold text-center">Create Anything with AI</h1>

			<div class="flex flex-col md:flex-row items-center justify-center gap-4">
				<Button
					variant={$page.data.session ? 'default' : 'gradient'}
					size="lg"
					class="text-lg"
					href={$page.data.session ? '/dashboard' : '/login'}
				>
					{#if $page.data.session}
						Dashboard
					{:else}
						Get Started
						<Sparkles class="ml-3" />
					{/if}
				</Button>

				<Button
					variant="secondary"
					size="lg"
					class="text-lg"
					on:click={() => {
						$pricingDialogOpen = true;
					}}>See Pricing</Button
				>
			</div>
		</div>

		<div class="grid items-center justify-center mt-12 gap-4">
			{#each routes as route}
				<Card.Root class="lg:w-[450px]">
					<Card.Header>
						<div class="flex items-center gap-4">
							<div>
								<svelte:component
									this={route.icon}
									class={cn(route.background_color, route.color, 'w-10 h-10 rounded-lg p-1')}
								/>
							</div>
							<div>
								<Card.Title>{route.label}</Card.Title>
								<Card.Description>{route.description}</Card.Description>
							</div>
						</div>
					</Card.Header>
				</Card.Root>
			{/each}
		</div>
	</div>
</div>

<PricingDialog />
