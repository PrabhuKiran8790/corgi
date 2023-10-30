<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { AudioSchema } from './constants';
	import { Music2 } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';
	import { premiumDialogOpen, premiumTierLimitDialogOpen } from '$lib/stores';
	import { invalidateAll } from '$app/navigation';

	export let audioForm: PageData['audioForm'];
	export let form: ActionData;

	let loading = false;

	$: if (form?.output) {
		loading = false;
		invalidateAll();
	}

	$: if (!form?.form.valid) {
		loading = false;
	}

	$: {
		if (form?.error === 'FREE_TIER_LIMIT_REACHED' || form?.error === 'SUBSCRIPTION_EXPIRED') {
			loading = false;
			$premiumDialogOpen = true;
		}

		if (form?.error === 'PREMIUM_TIER_LIMIT_REACHED') {
			loading = false;
			$premiumTierLimitDialogOpen.open = true;
			$premiumTierLimitDialogOpen.serviceType = 'audio';
		}
	}
</script>

<MetaTags title="Audio Generation | Corgi" description="Generate Audio using AI" />

<div class="h-full p-4">
	<Form.Root
		method="POST"
		form={audioForm}
		schema={AudioSchema}
		let:config
		class="container max-w-4xl border w-full p-3 rounded-lg space-y-4"
	>
		<Form.Field {config} name="prompt">
			<Form.Item>
				<Form.Label>Prompt</Form.Label>
				<Form.Textarea
					class="resize-none"
					placeholder="Edo25 major g melodies that sound triumphant and cinematic. Leading up to a crescendo that resolves in a 9th harmonic"
				/>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
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
				{:else}
					Generate
				{/if}
				<Music2 class="ml-2" size="1.2rem" />
			</Form.Button>
		</div>
	</Form.Root>
	<div class="flex items-center justify-center my-5">
		{#if loading}
			<span class="loader" />
		{:else if form?.output}
			<audio controls class="max-w-4xl w-full" src={form?.output} />
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
