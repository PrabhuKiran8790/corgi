<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { signIn } from '@auth/sveltekit/client';
	import { Github, Loader2 } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let isLoading = false;
	let googleLoading = false;
	let githubLoading = false;

	beforeNavigate(() => {
		// set isLoading to true according to the current button clicked
		isLoading = true;
	});

	const redirectUrl = $page.url.searchParams.get('redirectTo') || '/dashboard';

	const githubLogin = async () => {
		if (!$page.data.session) {
			githubLoading = true;
			await signIn('github', { callbackUrl: `${redirectUrl}` });
		}
	};

	const googleLogin = async () => {
		if (!$page.data.session) {
			googleLoading = true;
			await signIn('google', { callbackUrl: `${redirectUrl}` });
		}
	};
</script>

<MetaTags
	title="Login | Corgi AI"
	description="Create anything with AI"
	openGraph={{
		title: 'Login | Corgi AI',
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
		title: 'Login | Corgi AI',
		description: 'Create anything with AI',
		image: 'https://raw.githubusercontent.com/PrabhuKiran8790/corgi/main/static/corgi-home-min.png',
		imageAlt: 'Twitter image alt'
	}}
/>

<div class="flex items-center justify-center h-full overflow-x-hidden">
	<Card.Root
		class="flex flex-col items-center justify-center w-full h-full border-0 rounded-lg bg-[#000009]"
	>
		<Card.Header>
			<Card.Title
				><h1 class="text-4xl md:text-5xl text-start gfont text-white">Login</h1></Card.Title
			>
			<!-- <Card.Description class="text-center">AI Image Generation</Card.Description> -->
		</Card.Header>
		<Card.Content class="p-3">
			<div class="flex flex-col items-center justify-center gap-6">
				<Button
					on:click={githubLogin}
					disabled={isLoading}
					class={cn(
						buttonVariants({
							size: 'lg'
						}),
						'w-full bg-white text-black hover:bg-[#000009] hover:text-white hover:border hover:border-white/50 hover:transition-colors hover:duration-300'
					)}
				>
					<Github class="mr-2 w-7 h-7" />
					<h1 class="text-lg">
						{#if isLoading && githubLoading}
							<Loader2 class="w-7 h-7 animate-spin" />
						{:else}
							Login with Github
						{/if}
					</h1>
				</Button>
				<Button
					on:click={googleLogin}
					disabled={isLoading}
					class={cn(
						buttonVariants({
							size: 'lg'
						}),
						'w-full bg-white text-black hover:bg-[#000009] hover:text-white hover:border hover:border-white/50 hover:transition-colors hover:duration-300'
					)}
				>
					<svg
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 48 48"
						class="w-6 h-6 mr-2"
						><g
							><path
								fill="#EA4335"
								d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
							/><path
								fill="#4285F4"
								d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
							/><path
								fill="#FBBC05"
								d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
							/><path
								fill="#34A853"
								d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
							/><path fill="none" d="M0 0h48v48H0z" /></g
						></svg
					>
					<h1 class="text-lg">
						{#if isLoading && googleLoading}
							<Loader2 class="w-7 h-7 animate-spin" />
						{:else}
							Login with Google
						{/if}
					</h1>
				</Button>
			</div>
		</Card.Content>
		<Card.Footer class="flex flex-col items-center justify-center p-3 text-white">
			<p>by</p>
			<p class="p-1">Prabhu Kiran Konda</p>
		</Card.Footer>
	</Card.Root>
</div>
