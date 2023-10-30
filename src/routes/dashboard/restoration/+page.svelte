<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Download, Loader2, Sparkles, Upload } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { buttonVariants } from '$lib/components/ui/button';
	import { MetaTags } from 'svelte-meta-tags';
	import { premiumDialogOpen, premiumTierLimitDialogOpen } from '$lib/stores';
	import axios from 'axios';
	import { PUBLIC_CLOUDINARY_UPLOAD_PRESET, PUBLIC_PREMIUM_TIER_CREDITS } from '$env/static/public';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	let uploadedFileURL: string;
	let localsrc: string;
	let uploading: boolean = false;
	let uploaded: boolean = false;
	let restoring: boolean = false;
	let filename: string;

	export let form: ActionData;

	$: {
		if (form?.error === 'FREE_TIER_LIMIT_REACHED' || form?.error === 'SUBSCRIPTION_EXPIRED') {
			restoring = false;
			$premiumDialogOpen = true;
		}

		if (form?.error === 'PREMIUM_TIER_LIMIT_REACHED') {
			restoring = false;
			$premiumTierLimitDialogOpen.open = true;
			$premiumTierLimitDialogOpen.serviceType = 'imageRestoration';
		}

		if (form?.output) {
			invalidateAll();
		}
	}

	async function onChange(event: any) {
		if (data.data.code === 'FREE_TIER_LIMIT_REACHED' || data.data.code === 'SUBSCRIPTION_EXPIRED') {
			$premiumDialogOpen = true;
			return;
		}

		if (
			(data.data.userSubscriptionData?.imageRestorationCreditsUsed as number) >=
			Number(PUBLIC_PREMIUM_TIER_CREDITS)
		) {
			$premiumTierLimitDialogOpen.open = true;
			$premiumTierLimitDialogOpen.serviceType = 'imageRestoration';
			return;
		}

		const file = event.target.files[0];
		filename = file.name;
		if (file) {
			const reader = new FileReader();
			reader.addEventListener('load', function () {
				localsrc = reader.result as string;
			});
			reader.readAsDataURL(file);

			try {
				uploading = true;

				const formData = new FormData();
				formData.append('file', file);
				formData.append('upload_preset', PUBLIC_CLOUDINARY_UPLOAD_PRESET);

				const res = await axios.post(
					'https://api.cloudinary.com/v1_1/prabhukirankonda/image/upload',
					formData
				);
				console.log(res.data.secure_url);
				uploadedFileURL = res.data.secure_url;
				uploading = false;
				uploaded = true;
				localsrc = uploadedFileURL;
				toast.success('File uploaded successfully');
			} catch (e) {
				alert('Something went wrong');
			}
			return;
		}
	}
</script>

<MetaTags title="Image Restoration | Corgi" description="Generate Audio using AI" />

<div class="p-4 h-full space-y-4">
	<form
		class="container max-w-2xl border w-full p-3 rounded-lg space-y-4"
		method="post"
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
	>
		<input on:change={onChange} type="file" class="h-15 cursor-pointer" accept="image/*" />
		<div class="hidden"><input name="uploaded_file_url" bind:value={uploadedFileURL} /></div>
		<div class="flex items-center justify-center">
			<Button
				variant="secondary"
				class="w-96 border border-foreground/40"
				type="submit"
				disabled={!uploaded}
				on:click={() => {
					restoring = true;
				}}
			>
				{#if uploading}
					file is uploading
					<Loader2 class="ml-2 animate-spin" size="1.2rem" />
				{:else if uploaded && !restoring}
					Restore
					<Sparkles class="ml-2" size="1.2rem" />
				{:else if restoring && !form?.output}
					Restoring...
					<Loader2 class="ml-2 animate-spin" size="1.2rem" />
				{:else}
					Upload an Image <Upload class="ml-2" size="1.2rem" />
				{/if}
			</Button>
		</div>
	</form>
	<div class="flex flex-col lg:flex-row justify-between gap-6 md:space-x-10 lg:p-4">
		{#if localsrc || form?.uploadedFileURL}
			<div class="sticky">
				<img
					src={localsrc || form?.uploadedFileURL}
					alt="Preview"
					class="max-w-full lg:max-w-md rounded-lg"
				/>
			</div>
		{/if}
		{#if form?.output}
			<div class="max-w-full flex flex-col gap-2 items-center">
				<img src={form?.output} alt="Preview" class="max-w-full rounded-lg" />
				<a
					class={buttonVariants({
						variant: 'secondary',
						class: 'flex items-center justify-center w-52'
					})}
					href={form?.output}
					download={`restored_${filename}`}
					target="_blank">Download <Download class="ml-3" size="1.4rem" /></a
				>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	input[type='file']::file-selector-button {
		@apply inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 mr-5 bg-secondary text-secondary-foreground hover:bg-secondary/80;
	}

	input {
		@apply flex w-full rounded-md border border-input bg-transparent text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none ring-2 ring-ring/80 ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50;
	}
</style>
