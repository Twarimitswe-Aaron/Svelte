<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { resolve } from '$app/paths';

	const lesson = lessons[12];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const linkOptionsCode = `<a href="/about" data-sveltekit-preload-data="hover">Hover to preload</a>
<a href="/dashboard" data-sveltekit-noscroll>Do not scroll to top</a>
<a href="/login" data-sveltekit-reload>Force full page reload</a>
<a href="/settings" data-sveltekit-replacestate>Replace history state</a>`;
</script>

<svelte:head>
	<title>Lesson 13 — Link Options</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Allows you to configure navigation behavior for specific links using HTML data-attributes."
	whatFails="Without these attributes, you have to write manual click handlers to prevent scrolling or to preload data."
>
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="Link" size={20} class="text-(--color-accent)" />
		Link Attributes
	</h3>
	<div class="grid grid-cols-1 gap-3 mb-12">
		<div class="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) text-xs font-mono shrink-0 mt-1">data-sveltekit-preload-data</code>
			<p class="text-sm text-white/50 leading-relaxed">Preloads the data for the linked page when the user hovers or taps on the link. Options: "hover", "tap".</p>
		</div>
		<div class="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) text-xs font-mono shrink-0 mt-1">data-sveltekit-preload-code</code>
			<p class="text-sm text-white/50 leading-relaxed">Preloads only the JS code, not the data. Useful for heavy routes.</p>
		</div>
		<div class="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) text-xs font-mono shrink-0 mt-1">data-sveltekit-reload</code>
			<p class="text-sm text-white/50 leading-relaxed">Tells SvelteKit not to handle the link, causing a full browser native page reload.</p>
		</div>
		<div class="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) text-xs font-mono shrink-0 mt-1">data-sveltekit-noscroll</code>
			<p class="text-sm text-white/50 leading-relaxed">Prevents the default behavior of scrolling to the top of the page after navigation.</p>
		</div>
		<div class="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) text-xs font-mono shrink-0 mt-1">data-sveltekit-replacestate</code>
			<p class="text-sm text-white/50 leading-relaxed">Replaces the current history entry rather than creating a new one.</p>
		</div>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold mb-6 uppercase tracking-widest text-white/30">Examples</h3>
	<CodeBlock code={linkOptionsCode} lang="html" filename="+page.svelte" />

	<div class="mt-8 flex flex-col sm:flex-row gap-4">
		<a href={resolve('/lessons/12-remote-functions')} data-sveltekit-preload-data="hover" class="flex-1 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-(--color-accent)/50 transition-all group no-underline text-center">
			<div class="text-sm font-bold text-white mb-1">Hover to Preload</div>
			<div class="text-[10px] text-white/30 uppercase tracking-widest">Watch Network Tab</div>
		</a>
		<a href={resolve('/lessons/13-link-options')} data-sveltekit-noscroll class="flex-1 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-(--color-accent)/50 transition-all group no-underline text-center">
			<div class="text-sm font-bold text-white mb-1">No Scroll Click</div>
			<div class="text-[10px] text-white/30 uppercase tracking-widest">Stay at Scroll Pos</div>
		</a>
	</div>
</LessonLayout>
