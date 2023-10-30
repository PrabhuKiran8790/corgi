<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import corgi_typing_no_bg from '$lib/assets/corgi-typing-no-bg.png';
	import CodeRenderer from '$lib/components/code-renderer.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { premiumDialogOpen } from '$lib/stores';
	import { useChat } from 'ai/svelte';
	import { SendHorizontal } from 'lucide-svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import { MetaTags } from 'svelte-meta-tags';

	const { input, handleSubmit, messages } = useChat({
		onFinish() {
			invalidateAll();
		},
		onError(error) {
			if (error.message === 'FREE_TIER_LIMIT_REACHED' || error.message === 'SUBSCRIPTION_EXPIRED') {
				$premiumDialogOpen = true;
			}
			console.error(error);
			console.log(error.message);
		}
	});

	// set loading to true when change in messages is detected
	$: loading = $messages && $messages.length > 0;

	$: {
		// also set loading to false after changes in messages are detected and length is even (assistant has responded)
		if ($messages && $messages.length % 2 === 0) {
			loading = false;
		}
	}

	// when messages changes scroll into view to chatContent id
	$: {
		if ($messages && $messages.length > 0) {
			const chatContent = document.getElementById('chatContent');
			chatContent?.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<MetaTags title="Conversation | Corgi" description="Chat with AI" />

<div class="p-2 h-full">
	<div class="flex flex-col h-full">
		<div class="flex flex-col flex-grow gap-3 px-2 overflow-y-scroll mb-16 py-2">
			{#if $messages.length === 0}
				<div class="flex items-center justify-center h-full overflow-hidden">
					<h1 class="text-4xl font-bold text-muted-foreground">Chat with AI</h1>
				</div>
			{/if}
			{#each $messages as m}
				<div
					class={`flex gap-2 ${
						m.role === 'user'
							? 'bg-slate-100 dark:bg-black dark:border items-end'
							: 'bg-gray-200 dark:bg-foreground/10 items-start'
					} p-3 rounded-lg relative w-fit`}
				>
					{#if m.role === 'user' || m.role === 'assistant'}
						<Avatar.Root>
							<Avatar.Image
								src={m.role === 'user' ? $page.data.session?.user?.image : corgi_typing_no_bg}
								alt={`${$page.data.session?.user?.name}`}
							/>
							<Avatar.Fallback>
								{`${$page.data.session?.user?.name?.split(' ')[0][0]}${
									$page.data.session?.user?.name?.split(' ')[1][0]
								}`}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="ml-2">
							{#if m.role === 'user'}
								<div class="-mt-8">{m.content}</div>
							{:else if m.role === 'assistant'}
								{#key m.content}
									<div class="mt-2">
										<SvelteMarkdown source={m.content} renderers={{ code: CodeRenderer }} />
									</div>
								{/key}
							{/if}
						</div>
					{/if}
				</div>
			{/each}
			<div id="chatContent" />
			{#if loading}
				<div
					class={`flex gap-2 bg-gray-200 dark:bg-foreground/10 p-3 rounded-lg items-start relative`}
				>
					<Avatar.Root class="h-12 w-12">
						<Avatar.Image src={corgi_typing_no_bg} alt={`${$page.data.session?.user?.name}`} />
					</Avatar.Root>
					<div class="ml-4 mt-5">
						<div class="dot-pulse gradient" />
					</div>
				</div>
			{/if}
		</div>
		<form
			class="pb-4 fixed bottom-0 mt-12 right-0 w-full bg-white dark:bg-black p-3"
			on:submit={handleSubmit}
		>
			<div class="flex items-center justify-center gap-3 md:ml-72 px-2 md:px-10 md:pb-4">
				<Textarea
					class="flex items-center justify-center w-full px-3 pb-1 text-sm resize-none"
					placeholder="Ask something..."
					rows={1}
					autofocus
					bind:value={$input}
					on:keydown={(e) => {
						handleSubmit;
					}}
				/>
				<Button on:click={handleSubmit} size="sm">
					<SendHorizontal class="w-6 h-6" />
				</Button>
			</div>
		</form>
	</div>
</div>
