<script lang="ts">
	import { page } from '$app/stores';
	import { Navbar, Sidebar } from '$lib/components';
	import PremiumDialog from '$lib/components/premium-dialog.svelte';
	import PremiumTierLimitReachedDialog from '$lib/components/premium-tier-limit-reached-dialog.svelte';
	import { Toaster } from 'svelte-sonner';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="h-screen">
	<div
		class="hidden h-full md:flex md:w-72 md:inset-y-0 z-10 md:fixed border-r border-foreground/10"
	>
		<Sidebar
			credits={data.data.userData?.creditsUsed || 0}
			subscriptionStatusCode={data.data.code}
		/>
	</div>
	<main class="md:pl-72">
		<div class="flex flex-col h-screen">
			<Navbar
				subscriptionStatusCode={data.data.code}
				credits={data.data.userData?.creditsUsed || 0}
			/>
			<div class="flex-grow mt-20">
				<slot />
			</div>
		</div>
	</main>
</div>

<PremiumDialog />
<Toaster richColors closeButton />
<PremiumTierLimitReachedDialog userSubscriptionData={data.data.userSubscriptionData} />
