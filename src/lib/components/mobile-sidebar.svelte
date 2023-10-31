<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Menu } from 'lucide-svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Sidebar } from '$lib/components';
	import { page } from '$app/stores';
	import { darkmode } from '$lib/stores';

	export let subscriptionStatusCode: string;
	export let credits: number;
</script>

<div>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button class="md:hidden p-1" variant="ghost" size="sm" builders={[builder]}>
				<Menu />
			</Button>
		</Sheet.Trigger>
		<Sheet.Content
			side="left"
			class={`${!$darkmode && 'grainy'} dark:bg-black p-0 overflow-x-auto`}
		>
			<Sidebar {credits} {subscriptionStatusCode} />
		</Sheet.Content>
	</Sheet.Root>
</div>
