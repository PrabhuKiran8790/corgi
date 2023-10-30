<script lang="ts">
	import Codeblock from './codeblock.svelte';
	import * as languages from 'svelte-highlight/languages';
	import github from 'svelte-highlight/styles/github-dark.css';
	import * as prism from 'prismjs';

	export let lang: string;
	export let text: string;
	let formatted = '';

	if (prism.languages[lang]) {
		formatted = prism.highlight(text, prism.languages[lang], lang);
	}

	const languageMap = {
		bash: languages.bash,
		css: languages.css,
		javascript: languages.javascript,
		json: languages.json,
		markdown: languages.markdown,
		python: languages.python,
		java: languages.java,
		cpp: languages.cpp,
		c: languages.c,
		powershell: languages.powershell,
		scss: languages.scss,
		jsx: languages.javascript,
		tsx: languages.typescript,
		typescript: languages.typescript,
		svelte: languages.xml,
		vue: languages.xml,
		xml: languages.xml,
		html: languages.xml,
		yaml: languages.yaml,
		kotlin: languages.kotlin,
		go: languages.go
	};

	const mapLang_ = (lang: string) => languageMap[lang] || languages.java;
</script>

<svelte:head>
	{@html github}
</svelte:head>

{#if formatted == ''}
	<Codeblock language={mapLang_(lang)} code={text} title={lang} lineNumbers={true} />
{:else}
	<Codeblock language={mapLang_(lang)} code={text} title={lang} lineNumbers={true} />
{/if}
