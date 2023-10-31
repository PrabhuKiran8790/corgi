<script lang="ts">
	import { imageFormSchema, ImageOptions, ResolutionOptions } from './constants';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { Download, Loader2, Sparkles } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { ActionData, PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';
	import { premiumDialogOpen, premiumTierLimitDialogOpen } from '$lib/stores';
	import { invalidateAll } from '$app/navigation';

	export let form: ActionData;
	let loading = false;
	export let data: PageData;

	$: {
		if (form?.image?.data) {
			loading = false;
			invalidateAll();
		}

		if (!form?.form?.valid) {
			loading = false;
		}

		if (form?.error) {
			loading = false;
		}

		if (form?.error === 'FREE_TIER_LIMIT_REACHED' || form?.error === 'SUBSCRIPTION_EXPIRED') {
			$premiumDialogOpen = true;
		}
		if (form?.error === 'PREMIUM_TIER_LIMIT_REACHED') {
			loading = false;
			$premiumTierLimitDialogOpen.open = true;
			$premiumTierLimitDialogOpen.serviceType = 'image';
		}
	}
</script>

<MetaTags title="Image Generation | Corgi" description="Create stunning images using AI" />

<div>
	<div class="mt-5 p-3">
		<Form.Root
			method="POST"
			form={data.imageForm}
			schema={imageFormSchema}
			let:config
			class="container max-w-4xl border w-full p-3 rounded-lg space-y-2"
		>
			<Form.Field {config} name="prompt">
				<Form.Item>
					<Form.Label>Prompt</Form.Label>
					<Form.Textarea class="resize-none" />
					<Form.Validation class="dark:text-red-700" />
				</Form.Item>
			</Form.Field>
			<div class="grid grid-cols-2 gap-4">
				<Form.Field {config} name="count">
					<Form.Item>
						<Form.Label>Count</Form.Label>
						<Form.Select selected={ImageOptions[0]}>
							<Form.SelectTrigger placeholder="Number of Images" />
							<Form.SelectContent>
								{#each ImageOptions as option}
									<Form.SelectItem value={option.value} disabled={option.diabled}
										>{option.label}</Form.SelectItem
									>
								{/each}
							</Form.SelectContent>
						</Form.Select>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="resolution">
					<Form.Item>
						<Form.Label>Resolution</Form.Label>
						<Form.Select selected={ResolutionOptions[0]}>
							<Form.SelectTrigger placeholder="Image Resolution" />
							<Form.SelectContent>
								{#each ResolutionOptions as option}
									<Form.SelectItem value={option.value} disabled={option.diabled}
										>{option.label}</Form.SelectItem
									>
								{/each}
							</Form.SelectContent>
						</Form.Select>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</div>
			<div class="flex items-center justify-center">
				<Form.Button
					variant="secondary"
					class="w-96 border border-foreground/40"
					type="submit"
					on:click={() => {
						loading = true;
					}}
				>
					{#if loading}
						Generating...
						<Loader2 class="ml-3 h-5 w-5 animate-spin" />
					{:else}
						Generate
						<Sparkles class="ml-3 h-5 w-5" />
					{/if}
				</Form.Button>
			</div>
		</Form.Root>
	</div>

	<div class="flex items-center justify-center mt-10">
		{#if loading}
			<span class="loader" />
		{:else if form?.image?.data}
			<div class="flex mb-32">
				<div class="flex flex-col md:flex-row gap-4 mt-8 lg:px-32">
					{#each form?.image?.data as src}
						<Card.Card class="rounded-xl overflow-hidden">
							<div class="relative aspect-square">
								<!-- svelte-ignore a11y-img-redundant-alt -->
								<img src={src.url} alt="Image" />
							</div>
							<Card.CardFooter class="p-2">
								<Button variant="secondary" class="w-full" on:click={() => window.open(src.url)}>
									<Download class="h-4 w-4 mr-2" />
									Download
								</Button>
							</Card.CardFooter>
						</Card.Card>
					{/each}
				</div>
			</div>
		{:else}
			<p />
		{/if}
	</div>
</div>

<style>
	.loader {
		transform: rotateZ(45deg);
		perspective: 1000px;
		border-radius: 50%;
		width: 75px;
		height: 75px;
		color: #1681d2;
	}
	.loader:before,
	.loader:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: inherit;
		height: inherit;
		border-radius: 50%;
		transform: rotateX(70deg);
		animation: 1s spin linear infinite;
	}
	.loader:after {
		color: #ff3d00;
		transform: rotateY(70deg);
		animation-delay: 0.4s;
	}

	@keyframes rotate {
		0% {
			transform: translate(-50%, -50%) rotateZ(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotateZ(360deg);
		}
	}

	@keyframes rotateccw {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(-360deg);
		}
	}

	@keyframes spin {
		0%,
		100% {
			box-shadow: 0.2em 0px 0 0px currentcolor;
		}
		12% {
			box-shadow: 0.2em 0.2em 0 0 currentcolor;
		}
		25% {
			box-shadow: 0 0.2em 0 0px currentcolor;
		}
		37% {
			box-shadow: -0.2em 0.2em 0 0 currentcolor;
		}
		50% {
			box-shadow: -0.2em 0 0 0 currentcolor;
		}
		62% {
			box-shadow: -0.2em -0.2em 0 0 currentcolor;
		}
		75% {
			box-shadow: 0px -0.2em 0 0 currentcolor;
		}
		87% {
			box-shadow: 0.2em -0.2em 0 0 currentcolor;
		}
	}
</style>
