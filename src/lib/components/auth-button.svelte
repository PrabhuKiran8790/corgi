<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { signOut } from '@auth/sveltekit/client';
	import { buttonVariants } from './ui/button';
	import Button from './ui/button/button.svelte';
</script>

{#if !$page.data.session}
	<a href="/login" class={cn(buttonVariants(), $page.url.pathname === '/dashboard' && 'w-full')}>
		Sign in
	</a>
{:else}
	<!-- keep the w-full if url starts with /dashboard -->
	<Button
		class={cn(buttonVariants(), $page.url.pathname.startsWith('/dashboard') && 'w-full')}
		on:click={() => {
			signOut({
				callbackUrl: '/'
			});
		}}
	>
		Sign out
	</Button>
{/if}
