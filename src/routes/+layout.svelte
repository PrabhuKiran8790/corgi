<script>
	import '../app.postcss';
	import { MetaTags } from 'svelte-meta-tags';
	import { preparePageTransition } from '$lib/page-transition';
	preparePageTransition();
</script>

<MetaTags title="Corgi | Prabhu Kiran Konda" description="Create with AI" />

<slot />
