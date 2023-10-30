<script>
	import { navigating, page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { AuthButton, ThemeToggle } from '$lib/components';
	import { Loader2 } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { toLink } from '$lib/stores';

	const links = [
		{ name: 'Dashboard', href: '/dashboard' },
		{ name: 'Settings', href: '/dashboard/settings' }
	];
</script>

<div class="flex items-center gap-2">
	{#if $page.data.session}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root>
					<Avatar.Image
						src={$page.data.session.user?.image}
						alt={`${$page.data.session.user?.name}`}
					/>
					<Avatar.Fallback>
						{`${$page.data.session.user?.name?.split(' ')[0][0]}${
							$page.data.session.user?.name?.split(' ')[1][0]
						}`}
					</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="min-w-[150px] z-50">
				<DropdownMenu.Group>
					<DropdownMenu.Label>
						{$page.data.session.user?.name}
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#each links as link (link.href)}
						<DropdownMenu.Item
							href={link.href}
							on:click={() => {
								$toLink = link.href;
							}}
							class={cn(
								'hover:bg-foreground/10',
								$page.url.pathname === link.href && 'bg-foreground/10 text-foreground'
							)}
						>
							<div class="flex items-center justify-between">
								<div>{link.name}</div>
								{#if $navigating && $toLink === link.href}
									<Loader2 class="animate-spin h-4 w-4" />
								{/if}
							</div>
						</DropdownMenu.Item>
					{/each}
					<DropdownMenu.Separator />
					<DropdownMenu.Item class="p-[2px]">
						<AuthButton />
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{:else}
		<AuthButton />
	{/if}
	<ThemeToggle />
</div>
