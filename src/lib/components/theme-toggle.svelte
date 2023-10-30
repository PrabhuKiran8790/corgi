<script lang="ts">
	import { cn } from '$lib/utils';
	import { Moon, Sun } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { darkmode } from '$lib/stores';

	export let className = 'w-9 px-0';

	export let ariaLabel: string = 'Dark mode';

	const toggleTheme = () => {
		const isDark = window.document.documentElement.classList.toggle('dark');
		localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
		$darkmode = isDark;
	};
</script>

<svelte:head>
	<script>
		if ('color-theme' in localStorage) {
			// explicit preference - overrides author's choice
			localStorage.getItem('color-theme') === 'dark'
				? window.document.documentElement.classList.add('dark')
				: window.document.documentElement.classList.remove('dark');
		} else {
			// browser preference - does not overrides
			if (window.matchMedia('(prefers-color-scheme: dark)').matches)
				window.document.documentElement.classList.add('dark');
		}
	</script>
</svelte:head>

<Button
	on:click={toggleTheme}
	aria-label={ariaLabel}
	type="button"
	{...$$restProps}
	variant="ghost"
	size="sm"
	class={className}
>
	<span class="hidden dark:block">
		<slot name="lightIcon">
			<Sun class={cn('w-5 h-5', className)} />
		</slot>
	</span>
	<span class="block dark:hidden">
		<slot name="darkIcon">
			<Moon class={cn('w-5 h-5', className)} />
		</slot>
	</span>
</Button>
