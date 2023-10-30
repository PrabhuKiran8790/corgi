<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import github from 'svelte-highlight/styles/github-dark.css';
	import { storeHighlightJs } from './stores';
	import { clipboard } from './clipboard';
	import { Highlight } from 'svelte-highlight';
	import { Copy, CopyCheck } from 'lucide-svelte';
	import { Toaster, toast } from 'svelte-sonner';

	// Event Dispatcher
	type CodeBlockEvent = {
		copy: never;
	};
	const dispatch = createEventDispatcher<CodeBlockEvent>();

	// Types
	type CssClasses = string;

	export let language: any;
	export let code = '';

	export let lineNumbers = false;

	export let background: CssClasses = 'bg-neutral-900/90';
	export let blur: CssClasses = '';
	export let text: CssClasses = 'text-sm';
	export let color: CssClasses = 'text-white';
	export let rounded: CssClasses = 'rounded-container-token';
	export let shadow: CssClasses = 'shadow';
	export let button: CssClasses = 'btn btn-sm variant-soft !text-white';

	export let title: string;

	// Base Classes
	const cBase = 'overflow-hidden shadow-lg w-fit';
	const cHeader = 'text-xs text-white/50 uppercase flex justify-between items-center p-2 pl-4';
	// const cPre = 'overflow-auto p-4 pt-1';
	const cPre = 'whitespace-pre-wrap break-all p-4 pt-1';

	// Local
	let formatted = false;
	let displayCode: string = code;
	let copyState = false;

	// Allow shorthand alias, but show full text in UI
	function languageFormatter(lang: string): string {
		if (lang === 'js') return 'javascript';
		if (lang === 'ts') return 'typescript';
		if (lang === 'shell') return 'terminal';
		return lang;
	}

	// Handle Copy Text
	function onCopyClick() {
		copyState = true;
		toast.success('Copied to clipboard!');
		setTimeout(() => {
			copyState = false;
		}, 2000);
		dispatch('copy');
	}

	// Trigger syntax highlighting if highlight.js is available
	$: if ($storeHighlightJs !== undefined) {
		displayCode = $storeHighlightJs.highlight(code, { language }).value.trim();
		formatted = true;
	}

	$: if (lineNumbers) {
		displayCode = displayCode.replace(/^/gm, () => {
			return '<span class="line"></span>\t';
		});
		formatted = true;
	}

	// Reactive
	$: classesBase = `${cBase} ${background} ${blur} ${text} ${color} ${rounded} ${shadow} ${
		$$props.class ?? ''
	}`;
</script>

<svelte:head>
	{@html github}
</svelte:head>

<Toaster richColors closeButton />
{#if language && code}
	<div class="codeblock {classesBase} my-4 rounded-lg p-0" data-testid="codeblock">
		<!-- Header -->
		<header class="codeblock-header {cHeader}">
			<!-- Language -->
			<span class="codeblock-language">{languageFormatter(title)}</span>
			<!-- Copy Button -->
			<button class="codeblock-btn {button}" on:click={onCopyClick} use:clipboard={code}>
				{#if !copyState}
					<Copy class="w-5 h-5" />
				{:else}
					<CopyCheck class="w-5 h-5" />
				{/if}
			</button>
		</header>
		<Highlight {language} {code} class="-my-3 rounded-t-none" />
		<!-- <pre class="codeblock-pre {cPre} overflow-x-auto"><code class="codeblock-code language-{language} lineNumbers">{#if formatted}{@html displayCode}{:else}{code.trim()}{/if}</code></pre> -->
	</div>
{/if}
