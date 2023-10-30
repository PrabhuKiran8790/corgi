<script>
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getRoutes } from '$lib/config';
	import { premiumDialogOpen } from '$lib/stores';
	import { cn } from '$lib/utils';
	import { Check, Loader, Sparkles } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from './ui/button';
	import axios from 'axios';
	import { goto } from '$app/navigation';

	const routes = getRoutes(['/dashboard', '/dashboard/settings']);

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

<Dialog.Root
	open={$premiumDialogOpen}
	onOpenChange={() => {
		$premiumDialogOpen = false;
	}}
>
	<Dialog.Overlay class="opacity-[0.05]" />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="flex items-center justify-center flex-col gap-y-4 pb-2">
				<div class="flex items-center gap-x-2 font-bold py-1">
					Upgrade to
					<Badge class="gradient text-base font-bold"
						>Premium
						<Sparkles class="w-5 h-5 ml-2" />
					</Badge>
				</div>
				<p class="text-center text-muted-foreground text-sm">
					Upgrade to premium to get access to all features
				</p>
			</Dialog.Title>
			<Dialog.Description>
				<div class="flex flex-col space-y-2">
					{#each routes as route}
						<Card.Root>
							<Card.Header class="py-[21px]">
								<div class="flex items-center justify-between">
									<div class="flex items-center justify-center gap-5">
										<svelte:component
											this={route.icon}
											class={cn('w-8 h-8 rounded-lg p-1', route.color, route.background_color)}
										/>
										<div class="relative flex flex-col">
											{#if route.status}
												<Badge class="absolute -right-14 -top-3">{route.status}</Badge>
											{/if}
											<h1 class="text-start">{route.label}</h1>
											<Card.Description class="text-start">{route.pro_description}</Card.Description
											>
										</div>
									</div>
									<Check class="w-6 h-6 dark:text-sky-500" />
								</div></Card.Header
							>
						</Card.Root>
					{/each}
					<Button variant="gradient" on:click={onSubscribe}>
						Upgrade
						{#if loading}
							<Loader class="ml-2 animate-spin" />
						{:else}
							<Sparkles class="ml-2" />
						{/if}
					</Button>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
